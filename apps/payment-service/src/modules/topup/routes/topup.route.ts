import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authenticateToken } from "@capstone/common";
import { TopupController } from "../controllers/topup.controller.js";

const router: ExpressRouter = Router();
const topupController = new TopupController();

// Stripe redirects — no auth, must be before authenticated routes.
router.get("/stripe-return", topupController.handleStripeReturn);
router.get("/stripe-cancel", topupController.handleStripeCancel);

router.post("/create", authenticateToken, topupController.createOrder);
router.get("/:orderId", authenticateToken, topupController.getOrderStatus);

export default router;
