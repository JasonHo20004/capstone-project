import type { SubscriptionContract, User } from "@prisma/client";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { databaseService } from "@/services/database.service";
import { NotificationService, NOTIFICATION_TYPES } from "@/modules/notifications/services/notification.service";
import { ContractManagementRepository } from "../repositories/contract.repository";

export class ContractManagementService {
  private repository = new ContractManagementRepository();
  private userRepository = new UserRepository();
  private prisma = databaseService.getClient();
  private notificationService = new NotificationService();

  private async getDefaultSubscriptionPlan() {
    const subscriptionPlan = await this.prisma.subscriptionPlan.findFirst();
    if (!subscriptionPlan) {
      throw new Error(
        "Không tìm thấy gói đăng ký. Vui lòng tạo gói đăng ký mặc định trước."
      );
    }
    return subscriptionPlan;
  }

  public async getContractDashboard() {
    return await this.repository.getContractDashboard();
  }

  public async createMonthlyContract(data: {
    courseSellerId: string;
    notes?: string | undefined;
  }): Promise<SubscriptionContract> {
    const subscriptionPlan = await this.getDefaultSubscriptionPlan();

    const courseSeller = await this.userRepository.findCourseSellerById(
      data.courseSellerId
    );
    if (!courseSeller) {
      throw new Error("Không tìm thấy Giảng viên khóa học");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const newContract = await this.repository.createContract({
      courseSellerId: data.courseSellerId,
      subscriptionPlanId: subscriptionPlan.id,
      expiresAt,
      notes: data.notes || undefined,
    });

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
    const notifications =
      await this.notificationService.createRenewalReminderNotifications(
        data.contractIds,
        data.notificationType
      );

    const result = await this.notificationService.sendBulkNotifications(
      notifications
    );

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

    return { sentCount: result.sentCount, failedCount: result.failedCount };
  }

  public async handleNonRenewal(): Promise<{
    lockedAccounts: number;
    processedContracts: number;
  }> {
    const expiredContracts = await this.repository.getExpiredContracts();
    let lockedAccounts = 0;
    let processedContracts = expiredContracts.length;

    for (const contract of expiredContracts) {
      try {
        if (contract.status === true) {
          await this.lockExpiredAccounts(contract.id);
          lockedAccounts++;
        }
      } catch (_) {}
    }

    return { lockedAccounts, processedContracts };
  }

  public async lockExpiredAccounts(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    const contract = await this.prisma.subscriptionContract.findUnique({
      where: { id: contractId },
      include: { user: true, subscriptionPlan: true },
    });

    if (!contract) {
      throw new Error("Không tìm thấy hợp đồng");
    }

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
        expiresAt: { gt: new Date() },
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (enrolledStudents.length > 0) {
      const studentNotifications =
        await this.notificationService.createEnrolledStudentNotifications(
          contract.courseSellerId,
          contract.user.fullName
        );

      await this.notificationService.sendBulkNotifications(
        studentNotifications
      );
    }

    const lockResult = await this.repository.lockCourseSellerAccount(contractId);

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
    const currentContract = await this.prisma.subscriptionContract.findUnique({
      where: { id: data.contractId },
      include: { subscriptionPlan: true },
    });

    if (!currentContract) {
      throw new Error("Không tìm thấy hợp đồng");
    }

    const currentExpiry = currentContract.expiresAt;
    const newExpiresAt = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);

    const renewedContract = await this.repository.renewContract(
      data.contractId,
      newExpiresAt,
      data.notes || undefined
    );

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
    return await this.repository.updateContractStatus(
      data.contractId,
      data.status,
      data.notes || undefined
    );
  }

  public async getContractHistory(sellerId: string): Promise<SubscriptionContract[]> {
    return await this.repository.getContractHistory(sellerId);
  }

  public async lockSellerAccount(contractId: string): Promise<{
    contract: SubscriptionContract;
    user: User;
  }> {
    return await this.repository.lockCourseSellerAccount(contractId);
  }

  public async sendScheduledNotifications() {
    return await this.notificationService.sendScheduledRenewalNotifications();
  }
}