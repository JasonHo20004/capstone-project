// =============================================================================
// User Subscription Service - Business logic for user plans & subscriptions
// =============================================================================

import { UserSubscriptionRepository } from "../repositories/user-subscription.repository.js";
import { WalletRepository } from "../../wallet/repositories/wallet.repository.js";
import { AppError, BadRequestError, NotFoundError } from "@capstone/common";
import type { UserPlanType } from "../../../../generated/prisma/index.js";
import { getTotalUserCount } from "../../../clients/identity.client.js";

export class UserSubscriptionService {
  private repo = new UserSubscriptionRepository();
  private walletRepo = new WalletRepository();

  // ── Public Plans ──────────────────────────────────────────────────────

  async getPlans() {
    return await this.repo.findAllPlans();
  }

  async getPlansAdmin() {
    return await this.repo.findAllPlansAdmin();
  }

  // ── User Subscription ─────────────────────────────────────────────────

  async getMySubscription(userId: string) {
    const subscription = await this.repo.findActiveSubscription(userId);

    if (!subscription) {
      // If no subscription, return FREE plan status
      const freePlan = await this.repo.findPlanByType("FREE" as UserPlanType);
      return {
        plan: freePlan,
        subscription: null,
        isProUser: false,
      };
    }

    return {
      plan: subscription.plan,
      subscription,
      isProUser: subscription.plan.type === "PRO",
    };
  }

  async subscribe(userId: string, planId: string) {
    const plan = await this.repo.findPlanById(planId);
    if (!plan) throw new NotFoundError("Plan not found");
    if (!plan.isActive) throw new AppError("This plan is not available", 400);

    // Check if already subscribed to this plan
    const existing = await this.repo.findActiveSubscription(userId);
    if (existing?.planId === planId) {
      throw new AppError("You are already subscribed to this plan", 400);
    }

    const price = Number(plan.price);

    // If plan has a cost, deduct from wallet
    if (price > 0) {
      const wallet = await this.walletRepo.getOrCreate(userId);
      const balance = Number(wallet.allowance);

      if (balance < price) {
        throw new AppError(
          `Insufficient balance. Required: ${price}, Available: ${balance}`,
          400
        );
      }

      // Deduct from wallet
      await this.walletRepo.updateBalance(wallet.id, -price);

      // Create transaction record
      await this.walletRepo.createTransaction({
        walletId: wallet.id,
        amount: -price,
        transactionType: "SUBSCRIPTION",
        status: "SUCCESS",
        description: `Subscription: ${plan.name} plan`,
      });
    }

    // Deactivate existing subscriptions
    await this.repo.deactivateAllUserSubscriptions(userId);

    // Create new subscription (30 days for paid plans, no end date for free)
    const endDate = price > 0
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : undefined;

    const subscription = await this.repo.createSubscription({
      userId,
      planId,
      endDate,
    });

    return subscription;
  }

  async cancelSubscription(userId: string) {
    const existing = await this.repo.findActiveSubscription(userId);
    if (!existing) throw new AppError("No active subscription found", 400);

    const planPrice = Number(existing.plan.price);
    let refundAmount = 0;

    // Pro-rate refund for paid plans with remaining time
    if (planPrice > 0 && existing.endDate) {
      const now = new Date();
      const endDate = new Date(existing.endDate);
      const startDate = new Date(existing.startDate);

      if (endDate > now) {
        const totalDays = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const remainingDays = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        refundAmount = Math.floor((remainingDays / totalDays) * planPrice);

        if (refundAmount > 0) {
          const wallet = await this.walletRepo.getOrCreate(userId);
          await this.walletRepo.updateBalance(wallet.id, refundAmount);
          await this.walletRepo.createTransaction({
            walletId: wallet.id,
            amount: refundAmount,
            transactionType: "SUBSCRIPTION",
            status: "SUCCESS",
            description: `Refund: ${existing.plan.name} plan (${remainingDays} days remaining)`,
          });
        }
      }
    }

    // Deactivate current subscription
    await this.repo.deactivateAllUserSubscriptions(userId);

    // Auto-subscribe to free plan
    const freePlan = await this.repo.findPlanByType("FREE" as UserPlanType);
    if (freePlan) {
      await this.repo.createSubscription({
        userId,
        planId: freePlan.id,
      });
    }

    return {
      message: "Subscription cancelled, reverted to Free plan",
      refundAmount,
    };
  }

  // ── Admin ─────────────────────────────────────────────────────────────

  async updatePlan(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    features?: string[];
    isActive?: boolean;
  }) {
    const plan = await this.repo.findPlanById(id);
    if (!plan) throw new NotFoundError("Plan not found");
    return await this.repo.updatePlan(id, data);
  }

  async createPlan(data: {
    name: string;
    type: UserPlanType;
    price: number;
    description?: string;
    features: string[];
  }) {
    const existingType = await this.repo.findPlanByType(data.type);
    if (existingType) {
      throw new BadRequestError(
        `A ${data.type} plan already exists. Each plan type can only have one plan.`
      );
    }
    return await this.repo.createPlan(data);
  }

  async deletePlan(id: string) {
    const plan = await this.repo.findPlanById(id);
    if (!plan) throw new NotFoundError("Plan not found");

    const activeSubs = await this.repo.countSubscriptionsByPlan(id);
    if (activeSubs > 0) {
      throw new BadRequestError(
        `Cannot delete plan: ${activeSubs} active subscription(s) still reference it. ` +
          `Migrate subscribers first or wait until they expire.`
      );
    }
    return await this.repo.deletePlan(id);
  }

  async seedDefaultPlans() {
    const existingFree = await this.repo.findPlanByType("FREE" as UserPlanType);
    const existingPro = await this.repo.findPlanByType("PRO" as UserPlanType);

    const results: any[] = [];

    if (!existingFree) {
      const free = await this.repo.createPlan({
        name: "Free",
        type: "FREE" as UserPlanType,
        price: 0,
        description: "Basic access with limited features",
        features: ["course_access", "flashcards", "basic_tests"],
      });
      results.push(free);
    }

    if (!existingPro) {
      const pro = await this.repo.createPlan({
        name: "Pro",
        type: "PRO" as UserPlanType,
        price: 99000,
        description: "Full access to all premium AI features",
        features: [
          "course_access",
          "flashcards",
          "basic_tests",
          "ai_speaking",
          "ai_writing",
          "dictation",
          "learning_path",
          "skill_tree",
        ],
      });
      results.push(pro);
    }

    return results;
  }

  // ── Admin: Plan Stats (dashboard) ─────────────────────────────────────

  /**
   * Aggregate per-plan stats for the admin dashboard.
   * - `activeCount`: currently active subscriptions per plan.
   * - `last30dCount`: subscriptions whose `createdAt` is within the last 30 days
   *   (used as a leading indicator of growth).
   * - `mrr`: active subscriber count × plan price (paid plans only).
   */
  async getPlanStats() {
    const [plans, activeByPlan, last30dByPlan, walletCount, identityCount] =
      await Promise.all([
        this.repo.findAllPlansAdmin(),
        this.repo.groupActiveSubscribersByPlan(),
        this.repo.groupSubscriptionsSinceByPlan(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ),
        this.repo.countActiveWallets(),
        getTotalUserCount(),
      ]);

    const activeMap = new Map(activeByPlan.map((r) => [r.planId, r.count]));
    const last30Map = new Map(last30dByPlan.map((r) => [r.planId, r.count]));

    // Prefer identity-service's authoritative count (counts every registered
    // user, not just those who've touched the wallet). Fall back to wallet
    // count if the cross-service call fails so the page still renders.
    const totalUsers = identityCount ?? walletCount;

    // FREE plan is "default" — users start there without a UserSubscription row
    // (see getMySubscription). To get the real count, subtract every user with
    // an explicit non-FREE active sub from the total.
    const nonFreeActive = plans
      .filter((p) => p.type !== "FREE")
      .reduce((sum, p) => sum + (activeMap.get(p.id) ?? 0), 0);
    const implicitFreeCount = Math.max(0, totalUsers - nonFreeActive);

    const perPlan = plans.map((p) => {
      const explicitActive = activeMap.get(p.id) ?? 0;
      // For FREE: explicit rows (users who cancelled PRO) + implicit users
      // (registered but never subscribed to PRO). Capped at the implicit total
      // so explicit-FREE rows aren't double-counted.
      const activeCount =
        p.type === "FREE" ? Math.max(explicitActive, implicitFreeCount) : explicitActive;
      const price = Number(p.price);
      return {
        planId: p.id,
        name: p.name,
        type: p.type,
        price,
        activeCount,
        last30dCount: last30Map.get(p.id) ?? 0,
        mrr: price > 0 ? activeCount * price : 0,
      };
    });

    return {
      perPlan,
      totals: {
        activeCount: perPlan.reduce((s, r) => s + r.activeCount, 0),
        mrr: perPlan.reduce((s, r) => s + r.mrr, 0),
        last30dCount: perPlan.reduce((s, r) => s + r.last30dCount, 0),
      },
    };
  }

  // ── Admin: Plan Feature Definitions ────────────────────────────────────

  async listFeatures() {
    return await this.repo.findAllFeatures();
  }

  async createFeature(input: {
    key: string;
    label: string;
    isPremium?: boolean;
    displayOrder?: number;
  }) {
    const key = input.key.trim();
    if (!key || !/^[a-z0-9_]+$/i.test(key)) {
      throw new BadRequestError("Feature key must be alphanumeric/underscore only");
    }
    const label = input.label.trim();
    if (!label) throw new BadRequestError("Feature label is required");
    const existing = await this.repo.findFeatureByKey(key);
    if (existing) throw new BadRequestError(`Feature key '${key}' already exists`);
    return await this.repo.createFeature({
      key,
      label,
      isPremium: input.isPremium ?? false,
      displayOrder: input.displayOrder ?? 0,
    });
  }

  async updateFeature(
    id: string,
    input: { label?: string; isPremium?: boolean; displayOrder?: number }
  ) {
    return await this.repo.updateFeature(id, {
      label: input.label?.trim(),
      isPremium: input.isPremium,
      displayOrder: input.displayOrder,
    });
  }

  async deleteFeature(id: string) {
    return await this.repo.deleteFeature(id);
  }

  // ── Feature Access Check ──────────────────────────────────────────────

  async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.repo.findActiveSubscription(userId);

    if (!subscription) {
      // Check free plan features
      const freePlan = await this.repo.findPlanByType("FREE" as UserPlanType);
      return freePlan?.features.includes(feature) ?? false;
    }

    // Check if subscription is expired
    if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
      // Try auto-renewal before downgrading
      const renewed = await this.tryAutoRenew(userId, subscription);
      if (renewed) {
        return subscription.plan.features.includes(feature);
      }

      await this.repo.deactivateSubscription(subscription.id);
      const freePlan = await this.repo.findPlanByType("FREE" as UserPlanType);
      return freePlan?.features.includes(feature) ?? false;
    }

    return subscription.plan.features.includes(feature);
  }

  // ── Subscription History ───────────────────────────────────────────────

  async getSubscriptionHistory(userId: string) {
    return await this.repo.findSubscriptionHistory(userId);
  }

  // ── Auto-Renewal ───────────────────────────────────────────────────────

  private async tryAutoRenew(
    userId: string,
    subscription: any
  ): Promise<boolean> {
    try {
      const plan = subscription.plan;
      const price = Number(plan.price);

      if (price <= 0) return false; // Free plans don't need renewal

      const wallet = await this.walletRepo.getOrCreate(userId);
      const balance = Number(wallet.allowance);

      if (balance < price) {
        console.log(
          `⚠️ [Auto-Renew] Insufficient balance for user ${userId}. Required: ${price}, Available: ${balance}`
        );
        return false;
      }

      // Deduct from wallet
      await this.walletRepo.updateBalance(wallet.id, -price);
      await this.walletRepo.createTransaction({
        walletId: wallet.id,
        amount: -price,
        transactionType: "SUBSCRIPTION",
        status: "SUCCESS",
        description: `Auto-renewal: ${plan.name} plan (30 days)`,
      });

      // Deactivate old and create new subscription
      await this.repo.deactivateAllUserSubscriptions(userId);
      await this.repo.createSubscription({
        userId,
        planId: plan.id,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      console.log(`✅ [Auto-Renew] User ${userId} renewed ${plan.name} plan`);
      return true;
    } catch (error) {
      console.error(`❌ [Auto-Renew] Failed for user ${userId}:`, error);
      return false;
    }
  }
}
