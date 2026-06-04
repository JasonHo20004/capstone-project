// =============================================================================
// Refund Routes
// =============================================================================

import { Router, type Router as IRouter } from "express";
import { RefundController } from "../controllers/refund.controller.js";
import { authenticateToken, requireAdmin } from "@capstone/common";

const router: IRouter = Router();
const controller = new RefundController();

// ── Learner endpoints ───────────────────────────────────────────────────
router.post("/refunds/request", authenticateToken, controller.create);
router.get("/refunds/my", authenticateToken, controller.listMine);

// ── Admin endpoints ─────────────────────────────────────────────────────
router.get("/admin/refunds", authenticateToken, requireAdmin, controller.listAdmin);
router.post("/admin/refunds/:id/approve", authenticateToken, requireAdmin, controller.approve);
router.post("/admin/refunds/:id/reject", authenticateToken, requireAdmin, controller.reject);

export default router;
