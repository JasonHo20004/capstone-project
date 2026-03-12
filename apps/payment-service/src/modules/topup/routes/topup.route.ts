import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authenticateToken } from "@capstone/common";
import { TopupController } from "../controllers/topup.controller.js";

const router: ExpressRouter = Router();
const topupController = new TopupController();

// express.raw is applied globally in app.ts before express.json for this path
router.post("/webhook", topupController.handleWebhook);
router.post("/create", authenticateToken, topupController.createOrder);
router.get("/:orderId", authenticateToken, topupController.getOrderStatus);

export default router;
