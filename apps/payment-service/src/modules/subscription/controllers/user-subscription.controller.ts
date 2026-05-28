// =============================================================================
// User Subscription Controller - HTTP handlers for subscription endpoints
// =============================================================================

import { Request, Response } from "express";
import { UserSubscriptionService } from "../services/user-subscription.service.js";
import { asyncHandler } from "@capstone/common";

export class UserSubscriptionController {
  private service = new UserSubscriptionService();

  // ── Public ────────────────────────────────────────────────────────────

  getPlans = asyncHandler(async (_req: Request, res: Response) => {
    const plans = await this.service.getPlans();
    res.json({ success: true, data: plans });
  });

  // ── User ──────────────────────────────────────────────────────────────

  getMySubscription = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.getMySubscription(userId);
    res.json({ success: true, data: result });
  });

  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { planId } = req.body;
    const subscription = await this.service.subscribe(userId, planId);
    res.json({ success: true, data: subscription, message: "Subscription successful" });
  });

  cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.cancelSubscription(userId);
    res.json({ success: true, data: result });
  });

  checkAccess = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const feature = req.params.feature as string;
    const hasAccess = await this.service.checkFeatureAccess(userId, feature);
    res.json({ success: true, data: { hasAccess, feature } });
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const history = await this.service.getSubscriptionHistory(userId);
    res.json({ success: true, data: history });
  });

  // ── Admin ─────────────────────────────────────────────────────────────

  getPlansAdmin = asyncHandler(async (_req: Request, res: Response) => {
    const plans = await this.service.getPlansAdmin();
    res.json({ success: true, data: plans });
  });

  updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const plan = await this.service.updatePlan(id, req.body);
    res.json({ success: true, data: plan });
  });

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const plan = await this.service.createPlan(req.body);
    res.status(201).json({ success: true, data: plan, message: "Plan created" });
  });

  deletePlan = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.service.deletePlan(id);
    res.json({ success: true, message: "Plan deleted" });
  });

  seedPlans = asyncHandler(async (_req: Request, res: Response) => {
    const results = await this.service.seedDefaultPlans();
    res.json({ success: true, data: results, message: "Plans seeded successfully" });
  });

  // Per-plan dashboard stats: subscriber counts + MRR + 30-day growth.
  getPlanStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.service.getPlanStats();
    res.json({ success: true, data: stats });
  });

  // ── Plan Feature Definitions (admin manages, FE reads to build UI) ─────

  getFeatures = asyncHandler(async (_req: Request, res: Response) => {
    const features = await this.service.listFeatures();
    res.json({ success: true, data: features });
  });

  createFeature = asyncHandler(async (req: Request, res: Response) => {
    const feature = await this.service.createFeature(req.body);
    res.status(201).json({ success: true, data: feature });
  });

  updateFeature = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const feature = await this.service.updateFeature(id, req.body);
    res.json({ success: true, data: feature });
  });

  deleteFeature = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.service.deleteFeature(id);
    res.json({ success: true });
  });

  // ── Internal (service-to-service) ──────────────────────────────────────

  checkAccessInternal = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const feature = req.params.feature as string;
    if (!userId) {
      res.status(400).json({ success: false, error: "userId query param required" });
      return;
    }
    const hasAccess = await this.service.checkFeatureAccess(userId, feature);
    res.json({ success: true, data: { hasAccess, feature } });
  });
}
