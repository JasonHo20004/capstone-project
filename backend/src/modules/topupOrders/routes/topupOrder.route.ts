import { Router } from 'express';
import { TopupOrderController } from '@/modules/topupOrders/controllers/topupOrder.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createTopupDTO } from '@/modules/topupOrders/dtos/topupOrder.dto';
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const topupOrderController = new TopupOrderController();



router.post('/create',authMiddleware,validate(createTopupDTO),topupOrderController.createOrder);


export default router;