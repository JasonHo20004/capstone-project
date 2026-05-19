// =============================================================================
// Cart Routes - Express routes for cart operations
// =============================================================================

import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authenticateToken } from "@capstone/common";

const router: ExpressRouter = Router();
const cartController = new CartController();

router.get("/", authenticateToken, cartController.getCart);
router.post("/add-to-cart", authenticateToken, cartController.addToCart);
router.post("/checkout/full-cart", authenticateToken, cartController.checkoutFullCart);
router.post("/checkout/partial", authenticateToken, cartController.checkoutPartial);
router.post("/checkout/direct-buy", authenticateToken, cartController.directBuy);
router.delete("/items/:cartItemId", authenticateToken, cartController.removeFromCart);
router.delete("/", authenticateToken, cartController.clearCart);

export default router;
