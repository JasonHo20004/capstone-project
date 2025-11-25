import { Router } from "express";
// import { validate } from '@/middlewares/validations.middleware';
import { RevenueController } from "@/modules/revenue-management-by-admin/controllers/revenue.controller";
import { UserRole } from "@/../generated/prisma";
import { authMiddleware, checkRole } from "@/middlewares/auth.middleware";
// import { getRevenueOverviewDTO} from '@/modules/revenue/dtos/revenue.dto';

const router = Router();
const revenueController = new RevenueController();

router.use(authMiddleware);
router.use(checkRole([UserRole.ADMINISTRATOR]));

router.get("/", revenueController.getRevenueData);
// router.get('/stats', revenueController.getRevenueStatsOnly);
// router.get('/transactions', revenueController.getTransactionsList);
// router.get('/export', revenueController.exportRevenue);

export default router;
