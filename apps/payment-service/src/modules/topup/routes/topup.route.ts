import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authenticateToken } from "@capstone/common";
import { TopupController } from "../controllers/topup.controller.js";

const router: ExpressRouter = Router();
const topupController = new TopupController();

// VNPay callbacks — no auth, must be before authenticated routes
router.get("/vnpay-return", topupController.handleReturn);
router.get("/ipn", topupController.handleIpn);

router.post("/create", authenticateToken, topupController.createOrder);
router.get("/:orderId", authenticateToken, topupController.getOrderStatus);

export default router;
