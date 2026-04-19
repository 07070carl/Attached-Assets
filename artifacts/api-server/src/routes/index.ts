import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import menuRouter from "./menu";
import tablesRouter from "./tables";
import ordersRouter from "./orders";
import reservationsRouter from "./reservations";
import reviewsRouter from "./reviews";
import inventoryRouter from "./inventory";
import staffRouter from "./staff";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(menuRouter);
router.use(tablesRouter);
router.use(ordersRouter);
router.use(reservationsRouter);
router.use(reviewsRouter);
router.use(inventoryRouter);
router.use(staffRouter);
router.use(analyticsRouter);

export default router;
