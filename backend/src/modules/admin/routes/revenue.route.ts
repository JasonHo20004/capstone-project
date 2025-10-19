import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';



import { getRevenueOverviewDTO, getRevenueByTransactionTypeDTO, getRevenueByPeriodDTO } from '@/modules/admin/dtos/revenue.dto';

const router = Router();
const adminController = new AdminController();



// /api/admin/revenue/overview
// /api/admin/revenue/by-transaction-type
// /api/admin/revenue/by-period
router.get('/overview', validate(getRevenueOverviewDTO), adminController.getRevenueOverview);   
router.get('/by-transaction-type', validate(getRevenueByTransactionTypeDTO), adminController.getRevenueByTransactionType);
router.get('/by-period', validate(getRevenueByPeriodDTO), adminController.getRevenueByPeriod);

export default router;
