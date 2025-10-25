import { databaseService } from "@/services/database.service";
import type {
  CourseSellerApplication,
  SubscriptionContract,
  User,
  ApplicationStatus
} from "@/../generated/prisma";

export class AdminRepository {
  private prisma = databaseService.getClient();

  public async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        profilePicture: true,
        dateOfBirth: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  public async updateApplicationStatus(
    applicationId: string,
    dataToUpdate: {
      status: ApplicationStatus;
      rejectionReason?: string;
      message?: string;
    }
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: {
        id: applicationId,
      },
      data: dataToUpdate,
    });
  }
  public async updateCourseSellerRole(userId: string): Promise<void> {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data:{role:"COURSESELLER"}
      });
    }
  public async approveCourseSellerApplication(
    applicationId: string,
    dataToUpdate: any
  ): Promise<CourseSellerApplication> {
    return this.prisma.courseSellerApplication.update({
      where: {
        id: applicationId,
      },
      data: dataToUpdate,
    });
  }

  public async findApplicationById(
    id: string
  ): Promise<CourseSellerApplication | null> {
    return this.prisma.courseSellerApplication.findUnique({
      where: { id: id, status: "PENDING" },
    });
  }
  // Contract Management Methods
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
      // Active contracts count
      this.prisma.subscriptionContract.count({
        where: {
          status: true,
          expiresAt: { gt: now },
        },
      }),
      // Contracts expiring in 7 days
      this.prisma.subscriptionContract.findMany({
        where: {
          status: true,
          expiresAt: {
            gte: now,
            lte: sevenDaysFromNow,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          subscriptionPlan: true,
        },
      }),
      // Expired contracts
      this.prisma.subscriptionContract.findMany({
        where: {
          OR: [{ status: false }, { expiresAt: { lt: now } }],
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          subscriptionPlan: true,
        },
      }),
      // Total revenue from active contracts
      this.prisma.subscriptionContract.aggregate({
        where: {
          status: true,
          expiresAt: { gt: now },
        },
        _sum: {
          renewalCount: true,
        },
      }),
      // Total renewals for rate calculation
      this.prisma.subscriptionContract.aggregate({
        _sum: {
          renewalCount: true,
        },
      }),
    ]);

    const renewalRate =
      totalRevenue._sum.renewalCount && renewalCount._sum.renewalCount
        ? (totalRevenue._sum.renewalCount / renewalCount._sum.renewalCount) *
          100
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
      include: {
        user: true,
        subscriptionPlan: true,
      },
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
      include: {
        user: true,
        subscriptionPlan: true,
      },
    });
  }

  public async getExpiringContracts(
    days: number = 7
  ): Promise<SubscriptionContract[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.prisma.subscriptionContract.findMany({
      where: {
        status: true,
        expiresAt: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        subscriptionPlan: true,
      },
    });
  }

  public async getExpiredContracts(): Promise<SubscriptionContract[]> {
    const now = new Date();

    return this.prisma.subscriptionContract.findMany({
      where: {
        OR: [{ status: false }, { expiresAt: { lt: now } }],
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
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
      data: {
        status,
        notes: notes || null,
      },
      include: {
        user: true,
        subscriptionPlan: true,
      },
    });
  }

  public async getContractHistory(
    sellerId: string
  ): Promise<SubscriptionContract[]> {
    return this.prisma.subscriptionContract.findMany({
      where: {
        courseSellerId: sellerId,
      },
      include: {
        subscriptionPlan: true,
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async lockCourseSellerAccount(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    const contract = await this.prisma.subscriptionContract.update({
      where: { id: contractId },
      data: {
        status: false,
      },
      include: {
        user: true,
        subscriptionPlan: true,
      },
    });

    const user = await this.prisma.user.update({
      where: { id: contract.courseSellerId },
      data: {
        courseSellerProfile: {
          update: {
            isActive: false,
          },
        },
      },
    });

    return { contract, user };
  }
}
