import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { addToCartDTO, directBuyDTO,partialCheckoutDTO} from '@/modules/cart/dtos/cart.dto';
import {CartController} from '../controllers/cart.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const cartController = new CartController();

router.post('/add-to-cart',authMiddleware,validate(addToCartDTO),cartController.addToCart);

router.get('/',authMiddleware,cartController.getUserCarts) 
router.post('/checkout/full-cart',authMiddleware,cartController.checkoutCart);

router.post('/checkout/direct-buy',authMiddleware, validate(directBuyDTO),cartController.checkoutDirectBuy)

router.post('/checkout/partial',authMiddleware, validate(partialCheckoutDTO),cartController.checkoutPartial)
export default router;