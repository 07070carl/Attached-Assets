import { Router, type IRouter } from "express";
import { eq, sql, gte, lte, and, desc } from "drizzle-orm";
import { db, ordersTable, reservationsTable, reviewsTable, inventoryTable, orderItemsTable, menuItemsTable } from "@workspace/db";
import { GetSalesReportQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/analytics/dashboard", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];

  const todayOrders = await db
    .select({
      count: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(${ordersTable.totalAmount}::numeric), 0)::float`,
    })
    .from(ordersTable)
    .where(
      and(
        sql`date(${ordersTable.createdAt}) = ${today}`,
        sql`${ordersTable.status} != 'cancelled'`
      )
    );

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekOrders = await db
    .select({
      revenue: sql<number>`coalesce(sum(${ordersTable.totalAmount}::numeric), 0)::float`,
    })
    .from(ordersTable)
    .where(
      and(
        gte(ordersTable.createdAt, weekStart),
        sql`${ordersTable.status} != 'cancelled'`
      )
    );

  const pendingOrders = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const activeReservations = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reservationsTable)
    .where(
      sql`${reservationsTable.status} in ('pending', 'confirmed', 'seated')`
    );

  const ratingStats = await db
    .select({
      avg: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)::float`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.isApproved, true));

  const lowStock = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inventoryTable)
    .where(lte(inventoryTable.currentStock, inventoryTable.reorderLevel));

  res.json({
    todayRevenue: todayOrders[0]?.revenue ?? 0,
    todayOrders: todayOrders[0]?.count ?? 0,
    activeReservations: activeReservations[0]?.count ?? 0,
    pendingOrders: pendingOrders[0]?.count ?? 0,
    averageRating: Math.round((ratingStats[0]?.avg ?? 0) * 10) / 10,
    totalReviews: ratingStats[0]?.count ?? 0,
    lowStockCount: lowStock[0]?.count ?? 0,
    weeklyRevenue: weekOrders[0]?.revenue ?? 0,
  });
});

router.get("/analytics/sales", async (req, res): Promise<void> => {
  const query = GetSalesReportQueryParams.safeParse(req.query);
  const period = query.success ? (query.data.period ?? "week") : "week";

  let days = 7;
  if (period === "today") days = 1;
  else if (period === "month") days = 30;
  else if (period === "year") days = 365;

  const rows = await db
    .select({
      date: sql<string>`date(${ordersTable.createdAt})::text`,
      revenue: sql<number>`coalesce(sum(${ordersTable.totalAmount}::numeric), 0)::float`,
      orderCount: sql<number>`count(*)::int`,
    })
    .from(ordersTable)
    .where(
      and(
        gte(ordersTable.createdAt, new Date(Date.now() - days * 86400000)),
        sql`${ordersTable.status} != 'cancelled'`
      )
    )
    .groupBy(sql`date(${ordersTable.createdAt})`)
    .orderBy(sql`date(${ordersTable.createdAt})`);

  res.json(rows);
});

router.get("/analytics/top-dishes", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      menuItemId: orderItemsTable.menuItemId,
      name: menuItemsTable.name,
      imageUrl: menuItemsTable.imageUrl,
      totalOrdered: sql<number>`sum(${orderItemsTable.quantity})::int`,
      revenue: sql<number>`sum(${orderItemsTable.subtotal}::numeric)::float`,
    })
    .from(orderItemsTable)
    .leftJoin(menuItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
    .leftJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
    .where(sql`${ordersTable.status} != 'cancelled'`)
    .groupBy(orderItemsTable.menuItemId, menuItemsTable.name, menuItemsTable.imageUrl)
    .orderBy(desc(sql`sum(${orderItemsTable.quantity})`))
    .limit(10);

  res.json(rows.map(r => ({
    menuItemId: r.menuItemId ?? 0,
    name: r.name ?? "Unknown",
    imageUrl: r.imageUrl,
    totalOrdered: r.totalOrdered ?? 0,
    revenue: r.revenue ?? 0,
  })));
});

router.get("/analytics/recent-activity", async (_req, res): Promise<void> => {
  const recentOrders = await db
    .select({
      id: ordersTable.id,
      customerName: ordersTable.customerName,
      status: ordersTable.status,
      totalAmount: ordersTable.totalAmount,
      type: ordersTable.type,
      createdAt: ordersTable.createdAt,
    })
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(5);

  const recentReservations = await db
    .select({
      id: reservationsTable.id,
      customerName: reservationsTable.customerName,
      status: reservationsTable.status,
      partySize: reservationsTable.partySize,
      reservationDate: reservationsTable.reservationDate,
      reservationTime: reservationsTable.reservationTime,
      createdAt: reservationsTable.createdAt,
    })
    .from(reservationsTable)
    .orderBy(desc(reservationsTable.createdAt))
    .limit(5);

  const activity = [
    ...recentOrders.map(o => ({
      id: o.id,
      type: "order" as const,
      customerName: o.customerName,
      description: `${o.type === "dine_in" ? "Dine-in" : "Takeout"} order`,
      status: o.status,
      amount: parseFloat(o.totalAmount as string),
      timestamp: o.createdAt.toISOString(),
    })),
    ...recentReservations.map(r => ({
      id: r.id,
      type: "reservation" as const,
      customerName: r.customerName,
      description: `Reservation for ${r.partySize} on ${r.reservationDate} at ${r.reservationTime}`,
      status: r.status,
      amount: null,
      timestamp: r.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  res.json(activity);
});

export default router;
