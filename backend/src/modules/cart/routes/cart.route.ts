import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { addToCartDTO} from '@/modules/cart/dtos/cart.dto';
import {CartController} from '../controllers/cart.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const cartController = new CartController();

router.post('/add-to-cart',authMiddleware,validate(addToCartDTO),cartController.addToCart);


export default router;