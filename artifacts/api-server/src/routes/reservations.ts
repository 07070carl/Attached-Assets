import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, reservationsTable, tablesTable } from "@workspace/db";
import {
  CreateReservationBody,
  UpdateReservationStatusBody,
  UpdateReservationStatusParams,
  GetReservationParams,
  GetReservationsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function formatReservation(r: {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  tableId: number | null;
  tableNumber: string | null | undefined;
  status: string;
  notes: string | null;
  createdAt: Date;
}) {
  return {
    ...r,
    tableNumber: r.tableNumber ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/reservations", async (req, res): Promise<void> => {
  const query = GetReservationsQueryParams.safeParse(req.query);
  const conditions = [];
  if (query.success) {
    if (query.data.status) conditions.push(eq(reservationsTable.status, query.data.status));
    if (query.data.date) conditions.push(eq(reservationsTable.reservationDate, query.data.date));
  }

  const rows = await db
    .select({
      id: reservationsTable.id,
      customerName: reservationsTable.customerName,
      customerPhone: reservationsTable.customerPhone,
      customerEmail: reservationsTable.customerEmail,
      partySize: reservationsTable.partySize,
      reservationDate: reservationsTable.reservationDate,
      reservationTime: reservationsTable.reservationTime,
      tableId: reservationsTable.tableId,
      tableNumber: tablesTable.tableNumber,
      status: reservationsTable.status,
      notes: reservationsTable.notes,
      createdAt: reservationsTable.createdAt,
    })
    .from(reservationsTable)
    .leftJoin(tablesTable, eq(reservationsTable.tableId, tablesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(reservationsTable.reservationDate, reservationsTable.reservationTime);

  res.json(await Promise.all(rows.map(formatReservation)));
});

router.get("/reservations/:id", async (req, res): Promise<void> => {
  const params = GetReservationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select({
      id: reservationsTable.id,
      customerName: reservationsTable.customerName,
      customerPhone: reservationsTable.customerPhone,
      customerEmail: reservationsTable.customerEmail,
      partySize: reservationsTable.partySize,
      reservationDate: reservationsTable.reservationDate,
      reservationTime: reservationsTable.reservationTime,
      tableId: reservationsTable.tableId,
      tableNumber: tablesTable.tableNumber,
      status: reservationsTable.status,
      notes: reservationsTable.notes,
      createdAt: reservationsTable.createdAt,
    })
    .from(reservationsTable)
    .leftJoin(tablesTable, eq(reservationsTable.tableId, tablesTable.id))
    .where(eq(reservationsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json(await formatReservation(row));
});

router.post("/reservations", async (req, res): Promise<void> => {
  const parsed = CreateReservationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [reservation] = await db.insert(reservationsTable).values(parsed.data).returning();
  res.status(201).json({
    ...reservation,
    tableNumber: null,
    createdAt: reservation.createdAt.toISOString(),
  });
});

router.patch("/reservations/:id/status", async (req, res): Promise<void> => {
  const params = UpdateReservationStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReservationStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(reservationsTable)
    .set({ status: parsed.data.status })
    .where(eq(reservationsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  const [row] = await db
    .select({
      id: reservationsTable.id,
      customerName: reservationsTable.customerName,
      customerPhone: reservationsTable.customerPhone,
      customerEmail: reservationsTable.customerEmail,
      partySize: reservationsTable.partySize,
      reservationDate: reservationsTable.reservationDate,
      reservationTime: reservationsTable.reservationTime,
      tableId: reservationsTable.tableId,
      tableNumber: tablesTable.tableNumber,
      status: reservationsTable.status,
      notes: reservationsTable.notes,
      createdAt: reservationsTable.createdAt,
    })
    .from(reservationsTable)
    .leftJoin(tablesTable, eq(reservationsTable.tableId, tablesTable.id))
    .where(eq(reservationsTable.id, updated.id));
  res.json(await formatReservation(row!));
});

export default router;
