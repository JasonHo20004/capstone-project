import { databaseService } from "@/services/database.service";

export interface NotificationData {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  notificationType: NotificationType;
  contractId?: string;
  courseId?: string;
  title: string;
  content: string;
}

export enum NotificationType {
  RENEWAL_REMINDER = 'RENEWAL_REMINDER',
  EXPIRATION_WARNING = 'EXPIRATION_WARNING',
  FINAL_NOTICE = 'FINAL_NOTICE',
  SELLER_ACCOUNT_LOCKED = 'SELLER_ACCOUNT_LOCKED',
  COURSE_SELLER_DISABLED = 'COURSE_SELLER_DISABLED'
}

export interface NotificationResult {
  sentCount: number;
  failedCount: number;
  details: Array<{
    recipientId: string;
    success: boolean;
    error?: string;
  }>;
}

export class NotificationService {
  private prisma = databaseService.getClient();

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
      // 1. Save in-app notification to database
      await this.saveInAppNotification(notification);

      // 2. Send email notification (optional - can be enabled later)
      // await this.sendEmailNotification(notification);

      // 3. Send push notification (optional - for mobile apps)
      // await this.sendPushNotification(notification);

      // 4. Log notification for debugging
      console.log(`[NOTIFICATION] ${notification.notificationType}:`);
      console.log(`  To: ${notification.recipientName} (${notification.recipientEmail})`);
      console.log(`  Title: ${notification.title}`);
      console.log(`  Content: ${notification.content}`);
      console.log(`  Type: ${notification.notificationType}`);
      if (notification.contractId) console.log(`  Contract ID: ${notification.contractId}`);
      if (notification.courseId) console.log(`  Course ID: ${notification.courseId}`);
      console.log('---');

    } catch (error) {
      console.error(`Failed to send notification to ${notification.recipientEmail}:`, error);
      throw error;
    }
  }

  /**
   * Save in-app notification to database
   */
  private async saveInAppNotification(notification: NotificationData): Promise<void> {
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
        type: notification.notificationType,
        contractId: notification.contractId || null,
        courseId: notification.courseId || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
        isRead: false,
        isArchived: false
      }
    });
  }

  /**
   * Send email notification (placeholder for future implementation)
   */
  private async sendEmailNotification(_notification: NotificationData): Promise<void> {
    // TODO: Implement email sending using SendGrid, AWS SES, etc.
    // Example:
    // await emailService.send({
    //   to: notification.recipientEmail,
    //   subject: notification.title,
    //   html: this.generateEmailTemplate(notification)
    // });
    
    console.log(`[EMAIL] Would send email to ${notification.recipientEmail}`);
  }

  /**
   * Send push notification (placeholder for future implementation)
   */
  private async sendPushNotification(_notification: NotificationData): Promise<void> {
    // TODO: Implement push notifications using Firebase, OneSignal, etc.
    // Example:
    // await pushService.send({
    //   userId: notification.recipientId,
    //   title: notification.title,
    //   body: notification.content,
    //   data: { type: notification.notificationType }
    // });
    
    console.log(`[PUSH] Would send push notification to ${notification.recipientId}`);
  }

  /**
   * Generate email template (placeholder)
   */
  private generateEmailTemplate(_notification: NotificationData): string {
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
    notificationType: NotificationType
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
        notificationType,
        contract.user.fullName,
        contract.expiresAt,
        contract.subscriptionPlan.name
      );

      return {
        recipientId: contract.courseSellerId,
        recipientEmail: contract.user.email,
        recipientName: contract.user.fullName,
        notificationType,
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
        notificationType: NotificationType.COURSE_SELLER_DISABLED,
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
    type: NotificationType,
    sellerName: string,
    expiresAt: Date,
    planName: string
  ): { title: string; content: string } {
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    switch (type) {
      case NotificationType.RENEWAL_REMINDER:
        return {
          title: 'Contract Renewal Reminder',
          content: `Dear ${sellerName},\n\nYour ${planName} contract will expire in ${daysUntilExpiry} days. Please renew your contract to continue providing courses on our platform.\n\nThank you for being part of our community!`
        };

      case NotificationType.EXPIRATION_WARNING:
        return {
          title: 'Contract Expiration Warning',
          content: `Dear ${sellerName},\n\nYour ${planName} contract will expire in ${daysUntilExpiry} days. This is your final reminder to renew your contract. Failure to renew will result in account suspension.\n\nPlease contact support if you need assistance.`
        };

      case NotificationType.FINAL_NOTICE:
        return {
          title: 'Final Contract Notice',
          content: `Dear ${sellerName},\n\nYour ${planName} contract has expired. Your account has been suspended and you can no longer create new courses. Please renew your contract to restore access.\n\nYour existing courses remain available to enrolled students.`
        };

      case NotificationType.SELLER_ACCOUNT_LOCKED:
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
   * Get contracts that need renewal notifications (for scheduled notifications)
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
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Not notified in the last 24 hours
        }
      },
      select: {
        id: true
      }
    });

    return contracts.map(contract => contract.id);
  }

  /**
   * Send scheduled renewal notifications (can be called by cron job)
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
        NotificationType.RENEWAL_REMINDER
      );
      totalSent += result.sentCount;
      totalFailed += result.failedCount;
      totalProcessed += contractsExpiringSoon.length;
    }

    // Send 1-day warnings
    if (contractsExpiringTomorrow.length > 0) {
      const result = await this.sendRenewalNotification(
        contractsExpiringTomorrow,
        NotificationType.EXPIRATION_WARNING
      );
      totalSent += result.sentCount;
      totalFailed += result.failedCount;
      totalProcessed += contractsExpiringTomorrow.length;
    }

    // Send final notices for expired contracts
    if (expiredContracts.length > 0) {
      const result = await this.sendRenewalNotification(
        expiredContracts.map(c => c.id),
        NotificationType.FINAL_NOTICE
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
   * Helper method to send renewal notifications (used by scheduled notifications)
   */
  private async sendRenewalNotification(
    contractIds: string[],
    type: NotificationType
  ): Promise<{ sentCount: number; failedCount: number }> {
    const notifications = await this.createRenewalReminderNotifications(contractIds, type);
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

  // ===== In-App Notification Management Methods =====

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
   * Get notification statistics for a user
   */
  public async getNotificationStats(userId: string): Promise<{
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
}
