// =============================================================================
// User Subscription Repository - Database operations for user plans & subscriptions
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { UserPlanType } from "../../../../generated/prisma/index.js";

export class UserSubscriptionRepository {
  private prisma = databaseService.getClient();

  // ── Plans ──────────────────────────────────────────────────────────────

  async findAllPlans() {
    return await this.prisma.userPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  }

  async findAllPlansAdmin() {
    return await this.prisma.userPlan.findMany({
      orderBy: { price: "asc" },
    });
  }

  async findPlanById(id: string) {
    return await this.prisma.userPlan.findUnique({ where: { id } });
  }

  async findPlanByType(type: UserPlanType) {
    return await this.prisma.userPlan.findUnique({ where: { type } });
  }

  async updatePlan(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    features?: string[];
    isActive?: boolean;
  }) {
    return await this.prisma.userPlan.update({
      where: { id },
      data,
    });
  }

  async createPlan(data: {
    name: string;
    type: UserPlanType;
    price: number;
    description?: string;
    features: string[];
  }) {
    return await this.prisma.userPlan.create({ data });
  }

  async deletePlan(id: string) {
    return await this.prisma.userPlan.delete({ where: { id } });
  }

  async countSubscriptionsByPlan(planId: string): Promise<number> {
    return await this.prisma.userSubscription.count({
      where: { planId, isActive: true },
    });
  }

  // ── Subscriptions ─────────────────────────────────────────────────────

  async findActiveSubscription(userId: string) {
    return await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async createSubscription(data: {
    userId: string;
    planId: string;
    endDate?: Date;
  }) {
    return await this.prisma.userSubscription.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        endDate: data.endDate,
        isActive: true,
      },
      include: { plan: true },
    });
  }

  async deactivateSubscription(id: string) {
    return await this.prisma.userSubscription.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deactivateAllUserSubscriptions(userId: string) {
    return await this.prisma.userSubscription.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  async findSubscriptionHistory(userId: string, limit = 20) {
    return await this.prisma.userSubscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // ── Plan-level stats (admin dashboard) ─────────────────────────────────

  /** Active subscriber count grouped by planId. */
  async groupActiveSubscribersByPlan() {
    const rows = await this.prisma.userSubscription.groupBy({
      by: ["planId"],
      where: { isActive: true },
      _count: { _all: true },
    });
    return rows.map((r) => ({ planId: r.planId, count: r._count._all }));
  }

  /**
   * Proxy for "total users on the platform" — wallets are lazy-created on
   * first interaction, so this counts users who actually use the platform
   * (excluding ghost registrations). Used to derive implicit-FREE count.
   */
  async countActiveWallets(): Promise<number> {
    return await this.prisma.wallet.count();
  }

  /** Subscriptions activated in the given window, grouped by planId. Used for trends. */
  async groupSubscriptionsSinceByPlan(since: Date) {
    const rows = await this.prisma.userSubscription.groupBy({
      by: ["planId"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    });
    return rows.map((r) => ({ planId: r.planId, count: r._count._all }));
  }

  // ── Plan Feature Definitions ───────────────────────────────────────────

  async findAllFeatures() {
    return await this.prisma.planFeatureDefinition.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async findFeatureByKey(key: string) {
    return await this.prisma.planFeatureDefinition.findUnique({ where: { key } });
  }

  async createFeature(data: {
    key: string;
    label: string;
    isPremium?: boolean;
    displayOrder?: number;
  }) {
    return await this.prisma.planFeatureDefinition.create({ data });
  }

  async updateFeature(
    id: string,
    data: { label?: string; isPremium?: boolean; displayOrder?: number }
  ) {
    return await this.prisma.planFeatureDefinition.update({ where: { id }, data });
  }

  async deleteFeature(id: string) {
    return await this.prisma.planFeatureDefinition.delete({ where: { id } });
  }
}
