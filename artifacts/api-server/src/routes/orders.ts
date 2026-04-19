import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, menuItemsTable, tablesTable } from "@workspace/db";
import {
  CreateOrderBody,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  GetOrderParams,
  GetOrdersQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrderWithItems(orderId: number) {
  const [order] = await db
    .select({
      id: ordersTable.id,
      customerName: ordersTable.customerName,
      customerPhone: ordersTable.customerPhone,
      type: ordersTable.type,
      status: ordersTable.status,
      tableId: ordersTable.tableId,
      tableNumber: tablesTable.tableNumber,
      totalAmount: ordersTable.totalAmount,
      notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
      updatedAt: ordersTable.updatedAt,
    })
    .from(ordersTable)
    .leftJoin(tablesTable, eq(ordersTable.tableId, tablesTable.id))
    .where(eq(ordersTable.id, orderId));

  if (!order) return null;

  const items = await db
    .select({
      id: orderItemsTable.id,
      menuItemId: orderItemsTable.menuItemId,
      menuItemName: menuItemsTable.name,
      quantity: orderItemsTable.quantity,
      unitPrice: orderItemsTable.unitPrice,
      subtotal: orderItemsTable.subtotal,
      notes: orderItemsTable.notes,
    })
    .from(orderItemsTable)
    .leftJoin(menuItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
    .where(eq(orderItemsTable.orderId, orderId));

  return {
    ...order,
    totalAmount: parseFloat(order.totalAmount as string),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: items.map(i => ({
      ...i,
      menuItemName: i.menuItemName ?? "Unknown",
      unitPrice: parseFloat(i.unitPrice as string),
      subtotal: parseFloat(i.subtotal as string),
    })),
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const query = GetOrdersQueryParams.safeParse(req.query);
  const conditions = [];
  if (query.success) {
    if (query.data.status) conditions.push(eq(ordersTable.status, query.data.status));
    if (query.data.type) conditions.push(eq(ordersTable.type, query.data.type));
  }

  const orders = await db
    .select({
      id: ordersTable.id,
      customerName: ordersTable.customerName,
      customerPhone: ordersTable.customerPhone,
      type: ordersTable.type,
      status: ordersTable.status,
      tableId: ordersTable.tableId,
      tableNumber: tablesTable.tableNumber,
      totalAmount: ordersTable.totalAmount,
      notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
      updatedAt: ordersTable.updatedAt,
    })
    .from(ordersTable)
    .leftJoin(tablesTable, eq(ordersTable.tableId, tablesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(ordersTable.createdAt);

  const result = await Promise.all(orders.map(async o => {
    const items = await db
      .select({
        id: orderItemsTable.id,
        menuItemId: orderItemsTable.menuItemId,
        menuItemName: menuItemsTable.name,
        quantity: orderItemsTable.quantity,
        unitPrice: orderItemsTable.unitPrice,
        subtotal: orderItemsTable.subtotal,
        notes: orderItemsTable.notes,
      })
      .from(orderItemsTable)
      .leftJoin(menuItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
      .where(eq(orderItemsTable.orderId, o.id));

    return {
      ...o,
      totalAmount: parseFloat(o.totalAmount as string),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: items.map(i => ({
        ...i,
        menuItemName: i.menuItemName ?? "Unknown",
        unitPrice: parseFloat(i.unitPrice as string),
        subtotal: parseFloat(i.subtotal as string),
      })),
    };
  }));

  res.json(result);
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const order = await getOrderWithItems(params.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, ...orderData } = parsed.data;

  // Fetch prices for each menu item
  let totalAmount = 0;
  const itemsWithPrices: Array<{
    menuItemId: number;
    quantity: number;
    notes: string | null | undefined;
    unitPrice: number;
    subtotal: number;
  }> = [];

  for (const item of items) {
    const [menuItem] = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, item.menuItemId));
    if (!menuItem) {
      res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
      return;
    }
    const unitPrice = parseFloat(menuItem.price as string);
    const subtotal = unitPrice * item.quantity;
    totalAmount += subtotal;
    itemsWithPrices.push({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes,
      unitPrice,
      subtotal,
    });
  }

  const [order] = await db.insert(ordersTable).values({
    ...orderData,
    totalAmount: String(totalAmount),
  }).returning();

  await db.insert(orderItemsTable).values(
    itemsWithPrices.map(i => ({
      orderId: order.id,
      menuItemId: i.menuItemId,
      quantity: i.quantity,
      notes: i.notes,
      unitPrice: String(i.unitPrice),
      subtotal: String(i.subtotal),
    }))
  );

  const fullOrder = await getOrderWithItems(order.id);
  res.status(201).json(fullOrder);
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const fullOrder = await getOrderWithItems(updated.id);
  res.json(fullOrder);
});

export default router;
