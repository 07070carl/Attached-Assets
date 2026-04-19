import { Router, type IRouter } from "express";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import { db, menuItemsTable, categoriesTable } from "@workspace/db";
import {
  CreateMenuItemBody,
  UpdateMenuItemBody,
  UpdateMenuItemParams,
  DeleteMenuItemParams,
  GetMenuItemParams,
  GetMenuItemsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu/featured", async (_req, res): Promise<void> => {
  const items = await db
    .select({
      id: menuItemsTable.id,
      categoryId: menuItemsTable.categoryId,
      categoryName: categoriesTable.name,
      name: menuItemsTable.name,
      description: menuItemsTable.description,
      price: menuItemsTable.price,
      imageUrl: menuItemsTable.imageUrl,
      isAvailable: menuItemsTable.isAvailable,
      isFeatured: menuItemsTable.isFeatured,
      allergens: menuItemsTable.allergens,
      createdAt: menuItemsTable.createdAt,
    })
    .from(menuItemsTable)
    .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
    .where(and(eq(menuItemsTable.isFeatured, true), eq(menuItemsTable.isAvailable, true)))
    .orderBy(menuItemsTable.name)
    .limit(6);

  res.json(items.map(item => ({
    ...item,
    price: parseFloat(item.price as string),
    createdAt: item.createdAt.toISOString(),
  })));
});

router.get("/menu", async (req, res): Promise<void> => {
  const query = GetMenuItemsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success) {
    if (query.data.categoryId != null) {
      conditions.push(eq(menuItemsTable.categoryId, query.data.categoryId));
    }
    if (query.data.available != null) {
      conditions.push(eq(menuItemsTable.isAvailable, query.data.available));
    }
  }

  const items = await db
    .select({
      id: menuItemsTable.id,
      categoryId: menuItemsTable.categoryId,
      categoryName: categoriesTable.name,
      name: menuItemsTable.name,
      description: menuItemsTable.description,
      price: menuItemsTable.price,
      imageUrl: menuItemsTable.imageUrl,
      isAvailable: menuItemsTable.isAvailable,
      isFeatured: menuItemsTable.isFeatured,
      allergens: menuItemsTable.allergens,
      createdAt: menuItemsTable.createdAt,
    })
    .from(menuItemsTable)
    .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(menuItemsTable.name);

  res.json(items.map(item => ({
    ...item,
    price: parseFloat(item.price as string),
    createdAt: item.createdAt.toISOString(),
  })));
});

router.get("/menu/:id", async (req, res): Promise<void> => {
  const params = GetMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db
    .select({
      id: menuItemsTable.id,
      categoryId: menuItemsTable.categoryId,
      categoryName: categoriesTable.name,
      name: menuItemsTable.name,
      description: menuItemsTable.description,
      price: menuItemsTable.price,
      imageUrl: menuItemsTable.imageUrl,
      isAvailable: menuItemsTable.isAvailable,
      isFeatured: menuItemsTable.isFeatured,
      allergens: menuItemsTable.allergens,
      createdAt: menuItemsTable.createdAt,
    })
    .from(menuItemsTable)
    .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
    .where(eq(menuItemsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json({
    ...item,
    price: parseFloat(item.price as string),
    createdAt: item.createdAt.toISOString(),
  });
});

router.post("/menu", async (req, res): Promise<void> => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(menuItemsTable).values({
    ...parsed.data,
    price: String(parsed.data.price),
  }).returning();
  res.status(201).json({
    ...item,
    price: parseFloat(item.price as string),
    createdAt: item.createdAt.toISOString(),
  });
});

router.put("/menu/:id", async (req, res): Promise<void> => {
  const params = UpdateMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(menuItemsTable)
    .set({ ...parsed.data, price: String(parsed.data.price) })
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json({
    ...item,
    price: parseFloat(item.price as string),
    createdAt: item.createdAt.toISOString(),
  });
});

router.delete("/menu/:id", async (req, res): Promise<void> => {
  const params = DeleteMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
