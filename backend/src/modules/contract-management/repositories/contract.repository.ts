import { databaseService } from "@/services/database.service";
import type { SubscriptionContract, User } from "@prisma/client";

export class ContractManagementRepository {
  private prisma = databaseService.getClient();

  public async getContractDashboard(): Promise<{
    activeContracts: number;
    expiringContracts: any[];
    expiredContracts: any[];
    totalRevenue: number;
    renewalRate: number;
  }> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      activeContracts,
      expiringContracts,
      expiredContracts,
      totalRevenue,
      renewalCount,
    ] = await Promise.all([
      this.prisma.subscriptionContract.count({
        where: { status: true, expiresAt: { gt: now } },
      }),
      this.prisma.subscriptionContract.findMany({
        where: { status: true, expiresAt: { gte: now, lte: sevenDaysFromNow } },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          subscriptionPlan: true,
        },
      }),
      this.prisma.subscriptionContract.findMany({
        where: { OR: [{ status: false }, { expiresAt: { lt: now } }] },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          subscriptionPlan: true,
        },
      }),
      this.prisma.subscriptionContract.aggregate({
        where: { status: true, expiresAt: { gt: now } },
        _sum: { renewalCount: true },
      }),
      this.prisma.subscriptionContract.aggregate({ _sum: { renewalCount: true } }),
    ]);

    const renewalRate =
      totalRevenue._sum.renewalCount && renewalCount._sum.renewalCount
        ? (totalRevenue._sum.renewalCount / renewalCount._sum.renewalCount) * 100
        : 0;

    return {
      activeContracts,
      expiringContracts,
      expiredContracts,
      totalRevenue: totalRevenue._sum.renewalCount || 0,
      renewalRate: Math.round(renewalRate * 100) / 100,
    };
  }

  public async createContract(data: {
    courseSellerId: string;
    subscriptionPlanId: string;
    expiresAt: Date;
    notes?: string | undefined;
  }): Promise<SubscriptionContract> {
    return this.prisma.subscriptionContract.create({
      data: {
        courseSellerId: data.courseSellerId,
        subscriptionPlanId: data.subscriptionPlanId,
        expiresAt: data.expiresAt,
        notes: data.notes || null,
        status: true,
      },
      include: { user: true, subscriptionPlan: true },
    });
  }

  public async renewContract(
    contractId: string,
    newExpiresAt: Date,
    notes?: string
  ): Promise<SubscriptionContract> {
    return this.prisma.subscriptionContract.update({
      where: { id: contractId },
      data: {
        expiresAt: newExpiresAt,
        status: true,
        renewalCount: { increment: 1 },
        lastRenewalAt: new Date(),
        notes: notes || null,
      },
      include: { user: true, subscriptionPlan: true },
    });
  }

  public async getExpiringContracts(days: number = 7): Promise<SubscriptionContract[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.prisma.subscriptionContract.findMany({
      where: { status: true, expiresAt: { gte: now, lte: futureDate } },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        subscriptionPlan: true,
      },
    });
  }

  public async getExpiredContracts(): Promise<SubscriptionContract[]> {
    const now = new Date();

    return this.prisma.subscriptionContract.findMany({
      where: { OR: [{ status: false }, { expiresAt: { lt: now } }] },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        subscriptionPlan: true,
      },
    });
  }

  public async updateContractStatus(
    contractId: string,
    status: boolean,
    notes?: string
  ): Promise<SubscriptionContract> {
    return this.prisma.subscriptionContract.update({
      where: { id: contractId },
      data: { status, notes: notes || null },
      include: { user: true, subscriptionPlan: true },
    });
  }

  public async getContractHistory(sellerId: string): Promise<SubscriptionContract[]> {
    return this.prisma.subscriptionContract.findMany({
      where: { courseSellerId: sellerId },
      include: { subscriptionPlan: true, transactions: true },
      orderBy: { createdAt: "desc" },
    });
  }

  public async lockCourseSellerAccount(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    const contract = await this.prisma.subscriptionContract.update({
      where: { id: contractId },
      data: { status: false },
      include: { user: true, subscriptionPlan: true },
    });

    const user = await this.prisma.user.update({
      where: { id: contract.courseSellerId },
      data: {
        courseSellerProfile: { update: { isActive: false } },
      },
    });

    return { contract, user };
  }
}