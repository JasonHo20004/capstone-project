import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';



import { getRevenueOverviewDTO} from '@/modules/admin/dtos/revenue.dto';

const router = Router();
const adminController = new AdminController();



router.get('/overview', validate(getRevenueOverviewDTO), adminController.getRevenueOverview);   


export default router;
