import { AdminRepository } from "@/modules/admin/repositories/admin.repository";
import { ApplicationStatus } from "@/../generated/prisma";
import type {
  CourseSellerApplication,
  CourseSellerProfile,
  SubscriptionContract,
  User,
} from "@/../generated/prisma";
import type { SafeUser } from "@/modules/users/dtos/user.dto";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { databaseService } from "@/services/database.service";

import { NotificationService, NOTIFICATION_TYPES } from "@/modules/notifications/services/notification.service";
<
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
      throw new Error(
        "No subscription plan found. Please create a default subscription plan first."
      );
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
    applicationId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
    message?: any
  ): Promise<CourseSellerApplication | CourseSellerProfile> {
    
    const existingApplication = await this.adminRepository.findApplicationById(
      applicationId
    );

    
    if (!existingApplication) {
      throw new Error("Application not found or has been deleted.");
    }

    if (status === "APPROVED") {
      // Logic nghiệp vụ và Transaction NẰM TẠI SERVICE
      const { userId, certification, expertise } = existingApplication;

      try {
        await this.adminRepository.updateCourseSellerRole(userId);

        // Update application status
        await this.prisma.courseSellerApplication.update({
          where: { id: applicationId },
          data: {
            status: ApplicationStatus.APPROVED,
            rejectionReason: null,
            message: null,
          },
        });

        // Create course seller profile
        const newProfile = await this.userRepository.createCourseSellerProfile({
          userId: userId,
          certification: certification,
          expertise: expertise,
        });

        return newProfile;
      } catch (error: any) {
        if (error.code === "P2002") {
          // Lỗi unique constraint (user đã có profile)
          throw new Error("This user already has a Course Seller profile.");
        }

        throw new Error("Can not approve this application.");
      }
    } else {
      if (!rejectionReason) {
        throw new Error("Need to have Rejection Reason.");
      }

      const dataToUpdate = {
        status: ApplicationStatus.REJECTED,
        message: message ,
        rejectionReason: rejectionReason,
      };

      // 1. Repository CHỈ query (update)
      return this.adminRepository.updateApplicationStatus(
        applicationId,
        dataToUpdate
      );
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
    const courseSeller = await this.userRepository.findCourseSellerById(
      data.courseSellerId
    );
    if (!courseSeller) {
      throw new Error("Course Seller not found");
    }

    // Calculate expiration date (30 days from now for monthly plan)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Create the contract
    const newContract = await this.adminRepository.createContract({
      courseSellerId: data.courseSellerId,
      subscriptionPlanId: subscriptionPlan.id,
      expiresAt,
      notes: data.notes || undefined,
    });

    // Send welcome notification to Course Seller
    const welcomeNotification =
      await this.notificationService.createRenewalReminderNotifications(
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
    notificationType:
      | "RENEWAL_REMINDER"
      | "EXPIRATION_WARNING"
      | "FINAL_NOTICE";
  }): Promise<{ sentCount: number; failedCount: number }> {
    // Create notifications using the notification service
    const notifications =
      await this.notificationService.createRenewalReminderNotifications(
        data.contractIds,
        data.notificationType
      );

    // Send bulk notifications
    const result = await this.notificationService.sendBulkNotifications(
      notifications
    );

    // Update notification timestamps for successful sends
    for (const detail of result.details) {
      if (detail.success) {
        const notification = notifications.find(
          (n) => n.recipientId === detail.recipientId
        );
        if (notification?.contractId) {
          await this.notificationService.updateContractNotificationTimestamp(
            notification.contractId
          );
        }
      }
    }

    return {
      sentCount: result.sentCount,
      failedCount: result.failedCount,
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
        console.error(
          `Failed to process expired contract ${contract.id}:`,
          error
        );
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
        subscriptionPlan: true,
      },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    // Check active students
    const enrolledStudents = await this.prisma.userActivity.findMany({
      where: {
        courseId: {
          in: await this.prisma.course
            .findMany({
              where: { courseSellerId: contract.courseSellerId },
              select: { id: true },
            })
            .then((courses) => courses.map((c) => c.id)),
        },
        expiresAt: {
          gt: new Date(),
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
      },
    });

    if (enrolledStudents.length > 0) {
      // Create and send notifications for enrolled students
      const studentNotifications =
        await this.notificationService.createEnrolledStudentNotifications(
          contract.courseSellerId,
          contract.user.fullName
        );

      const notificationResult =
        await this.notificationService.sendBulkNotifications(
          studentNotifications
        );
      console.log(
        `Sent notifications to ${notificationResult.sentCount} enrolled students for locked account`
      );
    }

    // Lock the account
    const lockResult = await this.adminRepository.lockCourseSellerAccount(
      contractId
    );

    // Send notification to Course Seller about account lock
    const sellerNotification =
      await this.notificationService.createRenewalReminderNotifications(
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
        subscriptionPlan: true,
      },
    });

    if (!currentContract) {
      throw new Error("Contract not found");
    }

    const currentExpiry = currentContract.expiresAt;
    const newExpiresAt = new Date(
      currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const renewedContract = await this.adminRepository.renewContract(
      data.contractId,
      newExpiresAt,
      data.notes || undefined
    );

    // Send renewal confirmation notification
    const renewalNotification =
      await this.notificationService.createRenewalReminderNotifications(
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

  public async getContractHistory(
    sellerId: string
  ): Promise<SubscriptionContract[]> {
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

 
}