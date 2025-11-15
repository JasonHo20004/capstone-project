import { databaseService } from "@/services/database.service";
import { NotificationTypeRepository } from "../repositories/notificationType.repository";
import { NotificationRepository } from "../repositories/notification.repository";

export interface NotificationData {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  notificationTypeName: string;
  contractId?: string;
  courseId?: string;
  title: string;
  content: string;
}

export const NOTIFICATION_TYPES = {
  RENEWAL_REMINDER: 'RENEWAL_REMINDER',
  EXPIRATION_WARNING: 'EXPIRATION_WARNING',
  FINAL_NOTICE: 'FINAL_NOTICE',
  SELLER_ACCOUNT_LOCKED: 'SELLER_ACCOUNT_LOCKED',
  COURSE_SELLER_DISABLED: 'COURSE_SELLER_DISABLED',
  COURSE_UPDATE: 'COURSE_UPDATE'
} as const;

export interface NotificationResult {
  sentCount: number;
  failedCount: number;
  details: NotificationDetail[];
}

export interface NotificationDetail {
  recipientId: string;
  success:boolean;
  error?:string;
}


export class NotificationService {
  private prisma = databaseService.getClient();
  private notificationTypeRepository = new NotificationTypeRepository();
  private notificationRepository = new NotificationRepository();

  /**
   * Send notifications to multiple recipients
   */
  public async sendBulkNotifications(
    notifications: NotificationData[]
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      sentCount: 0,
      failedCount: 0,
      details: []
    };

    for (const notification of notifications) {
      try {
        await this.sendNotification(notification);
        result.sentCount++;
        result.details.push({
          recipientId: notification.recipientId,
          success: true
        });
      } catch (error) {
        result.failedCount++;
        result.details.push({
          recipientId: notification.recipientId,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return result;
  }

  /**
   * Send a single notification
   */
  public async sendNotification(notification: NotificationData): Promise<void> {
    try {
      await this.saveInAppNotification(notification);

      if (notification.contractId) console.log(`  Contract ID: ${notification.contractId}`);
      if (notification.courseId) console.log(`  Course ID: ${notification.courseId}`);
      console.log('---');

    } catch (error) {
      console.error(`Failed to send notification to ${notification.recipientEmail}:`, error);
      throw error;
    }
  }

  private async saveInAppNotification(notification: NotificationData): Promise<void> {
    let notificationType = await this.notificationTypeRepository.findByName(notification.notificationTypeName);
    
    if (!notificationType) {
      notificationType = await this.notificationTypeRepository.create({
        name: notification.notificationTypeName,
        isLocked: true
      });
    }

    // Create the notification
    const createdNotification = await this.notificationRepository.create({
      title: notification.title,
      content: notification.content,
      notificationTypeId: notificationType.id,
      seen: false
    });

    // Add the notification to the user
    await this.notificationRepository.addToUsers(createdNotification.id, [notification.recipientId]);

    const metadata: any = {};
    
    if (notification.contractId) {
      metadata.contractId = notification.contractId;
    }
    
    if (notification.courseId) {
      metadata.courseId = notification.courseId;
    }

    await this.prisma.inAppNotification.create({
      data: {
        userId: notification.recipientId,
        title: notification.title,
        content: notification.content,
        type: notification.notificationTypeName,
        contractId: notification.contractId || null,
        courseId: notification.courseId || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
        isRead: false,
        isArchived: false
      }
    });
  }

  /**
   * Send email notification
   */
  // private async sendEmailNotification(_notification: NotificationData): Promise<void> {
  //   // TODO: Implement email sending using SendGrid, AWS SES, etc.
  //   // Example:
  //   // await emailService.send({
  //   //   to: notification.recipientEmail,
  //   //   subject: notification.title,
  //   //   html: this.generateEmailTemplate(notification)
  //   // });
    
  //   console.log(`[EMAIL] Would send email to ${notification.recipientEmail}`);
  // }

  /**
   * Send push notification
   */
  // private async sendPushNotification(_notification: NotificationData): Promise<void> {
  //   // TODO: Implement push notifications using Firebase, OneSignal, etc.
  //   // Example:
  //   // await pushService.send({
  //   //   userId: notification.recipientId,
  //   //   title: notification.title,
  //   //   body: notification.content,
  //   //   data: { type: notification.notificationType }
  //   // });
    
  //   console.log(`[PUSH] Would send push notification to ${notification.recipientId}`);
  // }

  /**
   * Generate email template (placeholder)
   */
  // @ts-ignore - Placeholder for future email functionality
  private _generateEmailTemplate(notification: NotificationData): string {
    return `
      <html>
        <body>
          <h2>${notification.title}</h2>
          <p>${notification.content.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>This is an automated notification from the system.</small></p>
        </body>
      </html>
    `;
  }

  /**
   * Create renewal reminder notifications for Course Sellers
   */
  public async createRenewalReminderNotifications(
    contractIds: string[],
    notificationTypeName: string
  ): Promise<NotificationData[]> {
    const contracts = await this.prisma.subscriptionContract.findMany({
      where: { id: { in: contractIds } },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        subscriptionPlan: true
      }
    });

    return contracts.map(contract => {
      const { title, content } = this.getNotificationContent(
        notificationTypeName,
        contract.user.fullName,
        contract.expiresAt,
        contract.subscriptionPlan.name
      );

      return {
        recipientId: contract.courseSellerId,
        recipientEmail: contract.user.email,
        recipientName: contract.user.fullName,
        notificationTypeName,
        contractId: contract.id,
        title,
        content
      };
    });
  }

  /**
   * Create notifications for enrolled students when Course Seller account is locked
   */
  public async createEnrolledStudentNotifications(
    courseSellerId: string,
    courseSellerName: string
  ): Promise<NotificationData[]> {
    // Get all courses from this seller
    const sellerCourses = await this.prisma.course.findMany({
      where: { courseSellerId },
      select: { id: true, title: true }
    });

    if (sellerCourses.length === 0) {
      return [];
    }

    const courseIds = sellerCourses.map(c => c.id);
    const courseMap = new Map(sellerCourses.map(c => [c.id, c.title]));

    // Get all active students enrolled in these courses
    const enrolledStudents = await this.prisma.userActivity.findMany({
      where: {
        courseId: {
          in: courseIds
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

    return enrolledStudents.map(activity => {
      const courseTitle = courseMap.get(activity.courseId) || 'Unknown Course';
      const { title, content } = this.getStudentNotificationContent(
        activity.user.fullName,
        courseTitle,
        courseSellerName
      );

      return {
        recipientId: activity.user.id,
        recipientEmail: activity.user.email,
        recipientName: activity.user.fullName,
        notificationTypeName: NOTIFICATION_TYPES.COURSE_SELLER_DISABLED,
        courseId: activity.courseId,
        title,
        content
      };
    });
  }

  /**
   * Get notification content based on type
   */
  private getNotificationContent(
    typeName: string,
    sellerName: string,
    expiresAt: Date,
    planName: string
  ): { title: string; content: string } {
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    switch (typeName) {
      case NOTIFICATION_TYPES.RENEWAL_REMINDER:
        return {
          title: 'Contract Renewal Reminder',
          content: `Dear ${sellerName},\n\nYour ${planName} contract will expire in ${daysUntilExpiry} days. Please renew your contract to continue providing courses on our platform.\n\nThank you for being part of our community!`
        };

      case NOTIFICATION_TYPES.EXPIRATION_WARNING:
        return {
          title: 'Contract Expiration Warning',
          content: `Dear ${sellerName},\n\nYour ${planName} contract will expire in ${daysUntilExpiry} days. This is your final reminder to renew your contract. Failure to renew will result in account suspension.\n\nPlease contact support if you need assistance.`
        };

      case NOTIFICATION_TYPES.FINAL_NOTICE:
        return {
          title: 'Final Contract Notice',
          content: `Dear ${sellerName},\n\nYour ${planName} contract has expired. Your account has been suspended and you can no longer create new courses. Please renew your contract to restore access.\n\nYour existing courses remain available to enrolled students.`
        };

      case NOTIFICATION_TYPES.SELLER_ACCOUNT_LOCKED:
        return {
          title: 'Account Suspended',
          content: `Dear ${sellerName},\n\nYour account has been suspended due to contract expiration. Please renew your contract to restore access to course creation features.\n\nYour existing courses remain available to enrolled students.`
        };

      default:
        return {
          title: 'Notification',
          content: `Dear ${sellerName},\n\nThis is a notification regarding your account.`
        };
    }
  }

  /**
   * Get notification content for students
   */
  private getStudentNotificationContent(
    studentName: string,
    courseTitle: string,
    sellerName: string
  ): { title: string; content: string } {
    return {
      title: 'Course Seller Account Update',
      content: `Dear ${studentName},\n\nWe wanted to inform you that ${sellerName}, the instructor of your course "${courseTitle}", has temporarily suspended their account due to contract expiration.\n\nDon't worry! You can continue accessing and learning from this course as usual. The course content remains fully available to you.\n\nIf you have any questions or concerns, please contact our support team.`
    };
  }

  /**
   * Update notification timestamp for contract
   */
  public async updateContractNotificationTimestamp(contractId: string): Promise<void> {
    await this.prisma.subscriptionContract.update({
      where: { id: contractId },
      data: {
        lastNotificationAt: new Date()
      }
    });
  }

  /**
   * Get contracts that need renewal notifications
   */
  public async getContractsNeedingNotifications(daysBeforeExpiry: number = 7): Promise<string[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

    const contracts = await this.prisma.subscriptionContract.findMany({
      where: {
        status: true,
        expiresAt: {
          gte: new Date(),
          lte: targetDate
        },
        lastNotificationAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true
      }
    });

    return contracts.map(contract => contract.id);
  }

  /**
   * Send scheduled renewal notifications
   */
  public async sendScheduledRenewalNotifications(): Promise<{
    sentCount: number;
    failedCount: number;
    totalProcessed: number;
  }> {
    // Get contracts expiring in 7 days
    const contractsExpiringSoon = await this.getContractsNeedingNotifications(7);
    
    // Get contracts expiring in 1 day
    const contractsExpiringTomorrow = await this.getContractsNeedingNotifications(1);
    
    // Get expired contracts
    const expiredContracts = await this.prisma.subscriptionContract.findMany({
      where: {
        status: true,
        expiresAt: {
          lt: new Date()
        }
      },
      select: { id: true }
    });

    let totalSent = 0;
    let totalFailed = 0;
    let totalProcessed = 0;

    // Send 7-day reminders
    if (contractsExpiringSoon.length > 0) {
      const result = await this.sendRenewalNotification(
        contractsExpiringSoon,
        NOTIFICATION_TYPES.RENEWAL_REMINDER
      );
      totalSent += result.sentCount;
      totalFailed += result.failedCount;
      totalProcessed += contractsExpiringSoon.length;
    }

    // Send 1-day warnings
    if (contractsExpiringTomorrow.length > 0) {
      const result = await this.sendRenewalNotification(
        contractsExpiringTomorrow,
        NOTIFICATION_TYPES.EXPIRATION_WARNING
      );
      totalSent += result.sentCount;
      totalFailed += result.failedCount;
      totalProcessed += contractsExpiringTomorrow.length;
    }

    // Send final notices for expired contracts
    if (expiredContracts.length > 0) {
      const result = await this.sendRenewalNotification(
        expiredContracts.map(c => c.id),
        NOTIFICATION_TYPES.FINAL_NOTICE
      );
      totalSent += result.sentCount;
      totalFailed += result.failedCount;
      totalProcessed += expiredContracts.length;
    }

    return {
      sentCount: totalSent,
      failedCount: totalFailed,
      totalProcessed
    };
  }

  /**
   * Helper method to send renewal notifications
   */
  private async sendRenewalNotification(
    contractIds: string[],
    typeName: string
  ): Promise<{ sentCount: number; failedCount: number }> {
    const notifications = await this.createRenewalReminderNotifications(contractIds, typeName);
    const result = await this.sendBulkNotifications(notifications);

    // Update notification timestamps for successful sends
    for (const detail of result.details) {
      if (detail.success) {
        const notification = notifications.find(n => n.recipientId === detail.recipientId);
        if (notification?.contractId) {
          await this.updateContractNotificationTimestamp(notification.contractId);
        }
      }
    }

    return {
      sentCount: result.sentCount,
      failedCount: result.failedCount
    };
  }

  /**
   * Get user's notifications with pagination and filtering
   */
  public async getUserNotifications(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
      type?: string;
    } = {}
  ): Promise<{
    notifications: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      isArchived: false
    };

    if (options.unreadOnly) {
      where.isRead = false;
    }

    if (options.type) {
      where.type = options.type;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.inAppNotification.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          type: true,
          isRead: true,
          createdAt: true,
          readAt: true,
          contractId: true,
          courseId: true,
          metadata: true
        }
      }),
      this.prisma.inAppNotification.count({ where })
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Mark notification as read
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.prisma.inAppNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  public async markAllNotificationsAsRead(userId: string): Promise<{ updatedCount: number }> {
    const result = await this.prisma.inAppNotification.updateMany({
      where: {
        userId,
        isRead: false,
        isArchived: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return { updatedCount: result.count };
  }

  /**
   * Archive notification
   */
  public async archiveNotification(notificationId: string): Promise<void> {
    await this.prisma.inAppNotification.update({
      where: { id: notificationId },
      data: {
        isArchived: true,
        archivedAt: new Date()
      }
    });
  }

  /**
   * Get notification statistics for a user (in-app notifications)
   */
  public async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    const [total, unread, byType] = await Promise.all([
      this.prisma.inAppNotification.count({
        where: {
          userId,
          isArchived: false
        }
      }),
      this.prisma.inAppNotification.count({
        where: {
          userId,
          isRead: false,
          isArchived: false
        }
      }),
      this.prisma.inAppNotification.groupBy({
        by: ['type'],
        where: {
          userId,
          isArchived: false
        },
        _count: {
          type: true
        }
      })
    ]);

    const typeStats = byType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      byType: typeStats
    };
  }

  /**
   * Clean up old notifications (for maintenance)
   */
  public async cleanupOldNotifications(daysOld: number = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.inAppNotification.deleteMany({
      where: {
        isArchived: true,
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    return { deletedCount: result.count };
  }

  /**
   * Get all notification types
   */
  public async getNotificationTypes() {
    return await this.notificationTypeRepository.findWithNotificationCounts();
  }

  /**
   * Create a new notification type
   */
  public async createNotificationType(data: { name: string; isLocked?: boolean }) {
    return await this.notificationTypeRepository.create(data);
  }

  /**
   * Update notification type
   */
  public async updateNotificationType(id: string, data: { name?: string; isLocked?: boolean }) {
    return await this.notificationTypeRepository.update(id, data);
  }

  /**
   * Delete notification type
   */
  public async deleteNotificationType(id: string) {
    return await this.notificationTypeRepository.delete(id);
  }

  /**
   * Lock notification type
   */
  public async lockNotificationType(id: string) {
    return await this.notificationTypeRepository.lock(id);
  }

  /**
   * Unlock notification type
   */
  public async unlockNotificationType(id: string) {
    return await this.notificationTypeRepository.unlock(id);
  }

  /**
   * Get all notifications with pagination
   */
  public async getNotifications(options: {
    page?: number;
    limit?: number;
    includeType?: boolean;
    includeUsers?: boolean;
  } = {}) {
    return await this.notificationRepository.findAll(options);
  }

  /**
   * Get notification by ID
   */
  public async getNotificationById(id: string, includeUsers: boolean = false) {
    return await this.notificationRepository.findById(id, includeUsers);
  }

  /**
   * Create a new notification
   */
  public async createNotification(data: {
    title: string;
    content: string;
    notificationTypeId: string;
    seen?: boolean;
  }) {
    return await this.notificationRepository.create(data);
  }

  /**
   * Update notification
   */
  public async updateNotification(id: string, data: {
    title?: string;
    content?: string;
    notificationTypeId?: string;
    seen?: boolean;
  }) {
    return await this.notificationRepository.update(id, data);
  }

  /**
   * Delete notification
   */
  public async deleteNotification(id: string) {
    return await this.notificationRepository.delete(id);
  }

  /**
   * Get notifications by type
   */
  public async getNotificationsByType(notificationTypeId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    return await this.notificationRepository.findByType(notificationTypeId, options);
  }

  /**
   * Get notifications by user
   */
  public async getNotificationsByUser(userId: string, options: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}) {
    return await this.notificationRepository.findByUser(userId, options);
  }

  /**
   * Mark notification as seen for user
   */
  public async markNotificationAsSeenForUser(notificationId: string, userId: string) {
    return await this.notificationRepository.markAsSeenForUser(notificationId, userId);
  }

  /**
   * Add notification to users
   */
  public async addNotificationToUsers(notificationId: string, userIds: string[]) {
    return await this.notificationRepository.addToUsers(notificationId, userIds);
  }

  /**
   * Remove notification from users
   */
  public async removeNotificationFromUsers(notificationId: string, userIds: string[]) {
    return await this.notificationRepository.removeFromUsers(notificationId, userIds);
  }

  /**
   * Get notification statistics
   */
  public async getNotificationStats() {
    return await this.notificationRepository.getStats();
  }

  public async sendCourseUpdateNotifications(
    courseId: string,
    title: string,
    content: string
  ): Promise<NotificationResult> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const enrolledStudents = await this.prisma.userActivity.findMany({
      where: {
        courseId,
        expiresAt: {
          gt: new Date(), // Only active enrollments
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (enrolledStudents.length === 0) {
      throw new Error('No students enrolled');
    }

    const result: NotificationResult = {
      sentCount: 0,
      failedCount: 0,
      details: [],
    };

    try {
      let notificationType = await this.notificationTypeRepository.findByName(
        NOTIFICATION_TYPES.COURSE_UPDATE
      );

      if (!notificationType) {
        notificationType = await this.notificationTypeRepository.create({
          name: NOTIFICATION_TYPES.COURSE_UPDATE,
          isLocked: true,
        });
      }

      const createdNotification = await this.notificationRepository.create({
        title,
        content,
        notificationTypeId: notificationType.id,
        seen: false,
      });

      const userIds = enrolledStudents.map((activity) => activity.user.id);
      const userNotifications = userIds.map((userId) => ({
        notificationId: createdNotification.id,
        userId,
      }));

      const inAppNotifications = enrolledStudents.map((activity) => ({
        userId: activity.user.id,
        title,
        content,
        type: NOTIFICATION_TYPES.COURSE_UPDATE,
        courseId,
        contractId: null,
        metadata: { courseId },
        isRead: false,
        isArchived: false,
      }));

      // Bulk create user notifications and in-app notifications
      await Promise.all([
        this.prisma.userNotification.createMany({
          data: userNotifications,
          skipDuplicates: true,
        }),
        this.prisma.inAppNotification.createMany({
          data: inAppNotifications,
        }),
      ]);

      result.sentCount = enrolledStudents.length;
      result.details = enrolledStudents.map((activity) => ({
        recipientId: activity.user.id,
        success: true,
      }));

      // TODO: Email notification implementation
      // await this.sendEmailNotifications(enrolledStudents, title, content);
    } catch (error) {
      result.failedCount = enrolledStudents.length;
      result.details = enrolledStudents.map((activity) => ({
        recipientId: activity.user.id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }));

      console.error(
        `Failed to send course update notifications for course ${courseId}:`,
        error
      );
    }

    if (result.failedCount > 0) {
      console.warn(
        `Course update notification delivery was incomplete for course ${courseId}. ` +
          `Sent: ${result.sentCount}, Failed: ${result.failedCount}`
      );
    }

    return result;
  }
}
