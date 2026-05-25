// =============================================================================
// Withdrawal Routes
// =============================================================================

import { Router, type Router as IRouter } from "express";
import { WithdrawalController } from "../controllers/withdrawal.controller.js";
import { authenticateToken, requireAdmin } from "@capstone/common";

const router: IRouter = Router();
const controller = new WithdrawalController();

// ── Seller endpoints ────────────────────────────────────────────────────
router.post("/seller/request", authenticateToken, controller.requestWithdrawal);
router.get("/seller/history", authenticateToken, controller.getSellerWithdrawals);
router.post("/seller/requests/:id/cancel", authenticateToken, controller.cancelWithdrawal);
router.post("/seller/requests/:id/retry", authenticateToken, controller.retryWithdrawal);

// ── Admin endpoints ─────────────────────────────────────────────────────
router.get("/admin/summary", authenticateToken, requireAdmin, controller.getAdminSummary);
router.get("/admin/requests", authenticateToken, requireAdmin, controller.getAdminRequests);
router.post("/admin/requests/:id/approve", authenticateToken, requireAdmin, controller.approveWithdrawal);
router.post("/admin/requests/:id/reject", authenticateToken, requireAdmin, controller.rejectWithdrawal);

export default router;
