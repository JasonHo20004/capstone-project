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

// User routes (authenticated)
router.get("/my-subscription", authenticateToken, controller.getMySubscription);
router.post("/subscribe", authenticateToken, controller.subscribe);
router.put("/cancel", authenticateToken, controller.cancelSubscription);
router.get("/check-access/:feature", authenticateToken, controller.checkAccess);
router.get("/history", authenticateToken, controller.getHistory);

// Admin routes
router.get("/admin/plans", authenticateToken, requireAdmin, controller.getPlansAdmin);
router.put("/admin/plans/:id", authenticateToken, requireAdmin, controller.updatePlan);
router.post("/admin/plans/seed", authenticateToken, requireAdmin, controller.seedPlans);

// Internal service-to-service routes (no JWT required, uses userId query param)
router.get("/internal/check-access/:feature", controller.checkAccessInternal);

export default router;
