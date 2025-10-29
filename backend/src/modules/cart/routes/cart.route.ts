import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { addToCartDTO, directBuyDTO} from '@/modules/cart/dtos/cart.dto';
import {CartController} from '../controllers/cart.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const cartController = new CartController();

router.post('/add-to-cart',authMiddleware,validate(addToCartDTO),cartController.addToCart);

router.post('/checkout/cart',authMiddleware,cartController.checkoutCart);

router.post('/checkout/direct-buy',authMiddleware, validate(directBuyDTO),cartController.checkoutDirectBuy)
export default router;