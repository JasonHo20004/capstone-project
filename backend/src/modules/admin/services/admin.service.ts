import { AdminRepository } from "@/modules/admin/repositories/admin.repository";
import type {
  CourseSellerApplication,
  ApplicationStatus,
  CourseSellerProfile,
  SubscriptionContract,
  User
} from "@/../generated/prisma";
import type {
  SafeUser
} from "@/modules/users/dtos/user.dto";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { databaseService } from "@/services/database.service";
import { NotificationService, NOTIFICATION_TYPES } from "./notification.service";
import type { RevenueOverviewResponse} from "../dtos/revenue.dto";

export class AdminService {
  private adminRepository = new AdminRepository();
  private userRepository = new UserRepository();
  private prisma = databaseService.getClient();
  private notificationService = new NotificationService();

  // Helper method to get the default subscription plan
  private async getDefaultSubscriptionPlan() {
    const subscriptionPlan = await this.prisma.subscriptionPlan.findFirst();
    if (!subscriptionPlan) {
      throw new Error('No subscription plan found. Please create a default subscription plan first.');
    }
    return subscriptionPlan;
  }

  public async getAllUsers(): Promise<SafeUser[]> {
      try {
        const users = await this.adminRepository.findAll();
  
        return users;
      } catch (error) {
        console.error("Error in userService.getAllUsers:", error);
        throw new Error("Failed to retrieve users");
      }
    }
  public async upgradeToCourseSeller(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
    message?: any
  ): Promise<CourseSellerApplication | CourseSellerProfile> {
    const existingCourseSeller = await this.userRepository.findCourseSellerById(
      userId
    );
    // console.log(existingCourseSeller)
    if (!existingCourseSeller) {
      throw new Error("Course Seller is not Pending");
    }
    const dataToUpdate: {
      status: ApplicationStatus;
      rejectionReason?:any
      message?: any
    } = {
      status: status,
    };
    if (status === "APPROVED") {
      const approveCourseSellerApplication =
        await this.adminRepository.approveCourseSellerApplication(
          userId,
          dataToUpdate
        );

      const courseSellerData: {
        certification: string[];
        expertise: string[];
        userId: string;
      } = {
        certification: approveCourseSellerApplication.certification,
        expertise: approveCourseSellerApplication.expertise,
        userId: userId,
      };
      const courseSellerProfile =
        await this.userRepository.createCourseSellerProfile(courseSellerData);
      return courseSellerProfile;
    } else {
      dataToUpdate.message = message;
      dataToUpdate.rejectionReason = rejectionReason;
      const approveCourseSellerApplication =
        await this.adminRepository.approveCourseSellerApplication(
          userId,
          dataToUpdate
        );
      return approveCourseSellerApplication;
    }
  }

  // Contract Management Services
  public async getContractDashboard() {
    return await this.adminRepository.getContractDashboard();
  }

  public async createMonthlyContract(data: {
    courseSellerId: string;
    notes?: string | undefined;
  }): Promise<SubscriptionContract> {
    // Get the default subscription plan
    const subscriptionPlan = await this.getDefaultSubscriptionPlan();

    // Check if course seller exists
    const courseSeller = await this.userRepository.findCourseSellerById(data.courseSellerId);
    if (!courseSeller) {
      throw new Error('Course Seller not found');
    }

    // Calculate expiration date (30 days from now for monthly plan)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Create the contract
    const newContract = await this.adminRepository.createContract({
      courseSellerId: data.courseSellerId,
      subscriptionPlanId: subscriptionPlan.id,
      expiresAt,
      notes: data.notes || undefined
    });

    // Send welcome notification to Course Seller
    const welcomeNotification = await this.notificationService.createRenewalReminderNotifications(
      [newContract.id],
      NOTIFICATION_TYPES.RENEWAL_REMINDER
    );

    if (welcomeNotification.length > 0) {
      await this.notificationService.sendBulkNotifications(welcomeNotification);
    }

    return newContract;
  }

  public async sendRenewalNotification(data: {
    contractIds: string[];
    notificationType: 'RENEWAL_REMINDER' | 'EXPIRATION_WARNING' | 'FINAL_NOTICE';
  }): Promise<{ sentCount: number; failedCount: number }> {
    // Create notifications using the notification service
    const notifications = await this.notificationService.createRenewalReminderNotifications(
      data.contractIds,
      data.notificationType
    );

    // Send bulk notifications
    const result = await this.notificationService.sendBulkNotifications(notifications);

    // Update notification timestamps for successful sends
    for (const detail of result.details) {
      if (detail.success) {
        const notification = notifications.find(n => n.recipientId === detail.recipientId);
        if (notification?.contractId) {
          await this.notificationService.updateContractNotificationTimestamp(notification.contractId);
        }
      }
    }

    return {
      sentCount: result.sentCount,
      failedCount: result.failedCount
    };
  }

  public async handleNonRenewal(): Promise<{
    lockedAccounts: number;
    processedContracts: number;
  }> {
    // Get expired contracts
    const expiredContracts = await this.adminRepository.getExpiredContracts();
    let lockedAccounts = 0;
    let processedContracts = expiredContracts.length;

    for (const contract of expiredContracts) {
      try {
        if (contract.status === true) {
          await this.lockExpiredAccounts(contract.id);
          lockedAccounts++;
        }
      } catch (error) {
        console.error(`Failed to process expired contract ${contract.id}:`, error);
      }
    }

    return { lockedAccounts, processedContracts };
  }

  public async lockExpiredAccounts(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    const contract = await this.prisma.subscriptionContract.findUnique({
      where: { id: contractId },
      include: {
        user: true,
        subscriptionPlan: true
      }
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    // Check active students
    const enrolledStudents = await this.prisma.userActivity.findMany({
      where: {
        courseId: {
          in: await this.prisma.course.findMany({
            where: { courseSellerId: contract.courseSellerId },
            select: { id: true }
          }).then(courses => courses.map(c => c.id))
        },
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

      if (enrolledStudents.length > 0) {
        // Create and send notifications for enrolled students
        const studentNotifications = await this.notificationService.createEnrolledStudentNotifications(
          contract.courseSellerId,
          contract.user.fullName
        );
        
        const notificationResult = await this.notificationService.sendBulkNotifications(studentNotifications);
        console.log(`Sent notifications to ${notificationResult.sentCount} enrolled students for locked account`);
      }

    // Lock the account
    const lockResult = await this.adminRepository.lockCourseSellerAccount(contractId);

    // Send notification to Course Seller about account lock
    const sellerNotification = await this.notificationService.createRenewalReminderNotifications(
      [contractId],
      NOTIFICATION_TYPES.SELLER_ACCOUNT_LOCKED
    );

    if (sellerNotification.length > 0) {
      await this.notificationService.sendBulkNotifications(sellerNotification);
    }

    return lockResult;
  }

  public async renewContract(data: {
    contractId: string;
    notes?: string | undefined;
  }): Promise<SubscriptionContract> {
    // Get current contract
    const currentContract = await this.prisma.subscriptionContract.findUnique({
      where: { id: data.contractId },
      include: {
        subscriptionPlan: true
      }
    });

    if (!currentContract) {
      throw new Error('Contract not found');
    }

    const currentExpiry = currentContract.expiresAt;
    const newExpiresAt = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);

    const renewedContract = await this.adminRepository.renewContract(data.contractId, newExpiresAt, data.notes || undefined);

    // Send renewal confirmation notification
    const renewalNotification = await this.notificationService.createRenewalReminderNotifications(
      [data.contractId],
      NOTIFICATION_TYPES.RENEWAL_REMINDER
    );

    if (renewalNotification.length > 0) {
      await this.notificationService.sendBulkNotifications(renewalNotification);
    }

    return renewedContract;
  }

  public async updateContractStatus(data: {
    contractId: string;
    status: boolean;
    notes?: string | undefined;
  }): Promise<SubscriptionContract> {
    return await this.adminRepository.updateContractStatus(
      data.contractId,
      data.status,
      data.notes || undefined
    );
  }

  public async getContractHistory(sellerId: string): Promise<SubscriptionContract[]> {
    return await this.adminRepository.getContractHistory(sellerId);
  }

  public async lockSellerAccount(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    return await this.adminRepository.lockCourseSellerAccount(contractId);
  }

  public async sendScheduledNotifications() {
    return await this.notificationService.sendScheduledRenewalNotifications();
  }

  public async getRevenueOverview(
    period?: string,
    startDate?: string,
    endDate?: string,
    transactionType?: string,
    limit?: number,
    page?: number
  ): Promise<RevenueOverviewResponse> {
    let dateFilter: any = {};
    limit = limit || 50;
    page = page || 1;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        },
      };
    } else if (period) {
      switch (period) {
        case "today":
          dateFilter = {
            createdAt: {
              gte: now,
              lte: new Date(now.getTime() + 24 * 60 * 60 * 1000 - 1),
            },
          };
          break;
        case "week":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
          dateFilter = {
            createdAt: {
              gte: startOfWeek,
              lte: new Date(
                startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1
              ),
            },
          };
          break;
        case "month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          };
          break;
        case "quarter":
          const currentMonth = now.getMonth();
          const currentQuarter = Math.floor(currentMonth / 3);
          const startOfQuarter = new Date(
            now.getFullYear(),
            currentQuarter * 3,
            1
          );
          const endOfQuarter = new Date(
            now.getFullYear(),
            currentQuarter * 3 + 3,
            0
          );
          endOfQuarter.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfQuarter,
              lte: endOfQuarter,
            },
          };
          break;
        case "year":
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          endOfYear.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfYear,
              lte: endOfYear,
            },
          };
          break;
        default:
          // No specific period, fetch all data or default to a reasonable range
          break;
      }
    }

    const whereClause: any = {
      ...dateFilter,
      status: "SUCCESS",
    };

    if (transactionType) {
      whereClause.transactionType = transactionType;
    }

    console.log("🧪🌡️whereClause: ", whereClause);

    // Get total count for pagination
    const totalTransactionsCount = await this.prisma.transaction.count({
      where: whereClause,
    });

    // Get paginated transactions
    const transactions = await this.prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + t.amount.toNumber(),
      0
    );

    return {
      totalRevenue,
      totalTransactions: transactions.length,
      pagination: {
        total: totalTransactionsCount,
        page,
        limit,
        totalPages: Math.ceil(totalTransactionsCount / limit),
      },
    };
  }
}