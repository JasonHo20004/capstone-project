// =============================================================================
// Topup Routes - Express routes for topup operations
// =============================================================================

import { Router } from "express";
import { TopupController } from "../controllers/topup.controller.js";
import { authenticateToken } from "@capstone/common";

const router = Router();
const topupController = new TopupController();

router.post("/create", authenticateToken, topupController.createOrder);
router.post("/confirm-payment", authenticateToken, topupController.confirmPayment);

export default router;
