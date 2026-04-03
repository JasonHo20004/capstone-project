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
}
