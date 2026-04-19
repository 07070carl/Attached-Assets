import { Router, type IRouter } from "express";
import { eq, lte, sql } from "drizzle-orm";
import { db, inventoryTable } from "@workspace/db";
import {
  CreateInventoryItemBody,
  UpdateInventoryItemBody,
  UpdateInventoryItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatItem(item: typeof inventoryTable.$inferSelect) {
  return {
    ...item,
    currentStock: parseFloat(item.currentStock as string),
    reorderLevel: parseFloat(item.reorderLevel as string),
    costPerUnit: item.costPerUnit ? parseFloat(item.costPerUnit as string) : null,
    updatedAt: item.updatedAt.toISOString(),
  };
}

router.get("/inventory/low-stock", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(inventoryTable)
    .where(lte(inventoryTable.currentStock, inventoryTable.reorderLevel))
    .orderBy(inventoryTable.name);
  res.json(items.map(formatItem));
});

router.get("/inventory", async (_req, res): Promise<void> => {
  const items = await db.select().from(inventoryTable).orderBy(inventoryTable.name);
  res.json(items.map(formatItem));
});

router.post("/inventory", async (req, res): Promise<void> => {
  const parsed = CreateInventoryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(inventoryTable).values({
    ...parsed.data,
    currentStock: String(parsed.data.currentStock),
    reorderLevel: String(parsed.data.reorderLevel),
    costPerUnit: parsed.data.costPerUnit != null ? String(parsed.data.costPerUnit) : null,
  }).returning();
  res.status(201).json(formatItem(item));
});

router.put("/inventory/:id", async (req, res): Promise<void> => {
  const params = UpdateInventoryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateInventoryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(inventoryTable)
    .set({
      ...parsed.data,
      currentStock: String(parsed.data.currentStock),
      reorderLevel: String(parsed.data.reorderLevel),
      costPerUnit: parsed.data.costPerUnit != null ? String(parsed.data.costPerUnit) : null,
    })
    .where(eq(inventoryTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Inventory item not found" });
    return;
  }
  res.json(formatItem(item));
});

export default router;
