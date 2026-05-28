// =============================================================================
// User Subscription Routes
// =============================================================================

import { Router, type Router as RouterType } from "express";
import { UserSubscriptionController } from "../controllers/user-subscription.controller.js";
import { authenticateToken, requireAdmin } from "@capstone/common";

const router: RouterType = Router();
const controller = new UserSubscriptionController();

// Public routes
router.get("/plans", controller.getPlans);
router.get("/features", controller.getFeatures);

// User routes (authenticated)
router.get("/my-subscription", authenticateToken, controller.getMySubscription);
router.post("/subscribe", authenticateToken, controller.subscribe);
router.put("/cancel", authenticateToken, controller.cancelSubscription);
router.get("/check-access/:feature", authenticateToken, controller.checkAccess);
router.get("/history", authenticateToken, controller.getHistory);

// Admin routes
router.get("/admin/plans", authenticateToken, requireAdmin, controller.getPlansAdmin);
router.get("/admin/plans/stats", authenticateToken, requireAdmin, controller.getPlanStats);
router.post("/admin/plans", authenticateToken, requireAdmin, controller.createPlan);
router.put("/admin/plans/:id", authenticateToken, requireAdmin, controller.updatePlan);
router.delete("/admin/plans/:id", authenticateToken, requireAdmin, controller.deletePlan);
router.post("/admin/plans/seed", authenticateToken, requireAdmin, controller.seedPlans);
router.post("/admin/features", authenticateToken, requireAdmin, controller.createFeature);
router.put("/admin/features/:id", authenticateToken, requireAdmin, controller.updateFeature);
router.delete("/admin/features/:id", authenticateToken, requireAdmin, controller.deleteFeature);

// Internal service-to-service routes (no JWT required, uses userId query param)
router.get("/internal/check-access/:feature", controller.checkAccessInternal);

export default router;
