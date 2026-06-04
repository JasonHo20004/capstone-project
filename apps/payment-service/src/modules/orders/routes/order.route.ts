// =============================================================================
// Order Routes - Express routes for order operations
// =============================================================================

import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticateToken } from "@capstone/common";

const router: ExpressRouter = Router();
const orderController = new OrderController();

router.post("/", authenticateToken, orderController.createOrder);
router.post("/:id/pay", authenticateToken, orderController.payOrder);
router.get("/history", authenticateToken, orderController.getHistory);

export default router;
