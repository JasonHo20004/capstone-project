// =============================================================================
// Order Routes - Express routes for order operations
// =============================================================================

import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { authenticateToken, validate } from "@capstone/common";
import { createOrderSchema, payOrderSchema, getHistoryQuerySchema } from "../dtos/order.dto.js";

const router: ExpressRouter = Router();
const orderController = new OrderController();

router.post("/", authenticateToken, validate(createOrderSchema), orderController.createOrder);
router.post("/:id/pay", authenticateToken, validate(payOrderSchema), orderController.payOrder);
router.get("/history", authenticateToken, validate(getHistoryQuerySchema), orderController.getHistory);

export default router;
