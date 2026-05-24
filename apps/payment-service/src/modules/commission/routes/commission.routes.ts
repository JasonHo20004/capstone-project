// =============================================================================
// Commission Routes
// =============================================================================

import { Router, type Router as IRouter } from "express";
import { CommissionController } from "../controllers/commission.controller.js";
import { authenticateToken, requireAdmin } from "@capstone/common";

const router: IRouter = Router();
const controller = new CommissionController();

// Seller endpoints
router.get("/seller/earnings", authenticateToken, controller.getSellerEarnings);
router.get("/seller/earnings/timeseries", authenticateToken, controller.getSellerEarningsTimeseries);
router.get("/seller/earnings/by-course", authenticateToken, controller.getSellerEarningsByCourse);
router.get("/seller/rate", authenticateToken, controller.getSellerCommissionRate);
router.get("/seller/policy", authenticateToken, controller.getSellerPolicy);

// Admin endpoints
router.get("/admin/report", authenticateToken, requireAdmin, controller.getAdminReport);
router.get("/config", authenticateToken, requireAdmin, controller.getConfig);
router.put("/config", authenticateToken, requireAdmin, controller.updateGlobalRate);
router.patch("/config", authenticateToken, requireAdmin, controller.updateConfig);
router.post("/admin/release-earnings", authenticateToken, requireAdmin, controller.releaseEarnings);

// Internal service-to-service endpoints
router.post("/internal/refund-course/:courseId", controller.refundCourse);
router.get("/internal/seller/:sellerId/financial-summary", controller.getSellerFinancialSummary);

export default router;
