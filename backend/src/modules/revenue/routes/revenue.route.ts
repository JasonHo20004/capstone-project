import { Router } from 'express';
// import { validate } from '@/middlewares/validations.middleware';
import { RevenueController } from '@/modules/revenue/controllers/revenue.controller';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
// import { getRevenueOverviewDTO} from '@/modules/revenue/dtos/revenue.dto';

const router = Router();
const revenueController = new RevenueController();

router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))

// Legacy endpoint
// router.get('/overview', validate(getRevenueOverviewDTO), revenueController.getRevenueOverview);

// New endpoints
router.get('/stats', revenueController.getRevenueStatsOnly);
router.get('/transactions', revenueController.getTransactionsList);
router.get('/export', revenueController.exportRevenue);
router.get('/', revenueController.getRevenueData);

export default router;
