// =============================================================================
// Notification Repository - Database Operations
// =============================================================================

import { PrismaClient, Prisma } from "../../../../generated/prisma/index.js";
import { databaseService } from "../../../services/index.js";

export class NotificationRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || databaseService.getClient();
  }

  // ============== In-App Notification Operations ==============

  async createNotification(data: {
    userId: string;
    title: string;
    content: string;
    type: string;
    contractId?: string;
    courseId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return await this.prisma.inAppNotification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        contractId: data.contractId,
        courseId: data.courseId,
        metadata: data.metadata as Prisma.JsonObject | undefined,
      },
    });
  }

  async createManyNotifications(data: Array<{
    userId: string;
    title: string;
    content: string;
    type: string;
    metadata?: Record<string, unknown>;
  }>) {
    return await this.prisma.inAppNotification.createMany({
      data: data.map((item) => ({
        userId: item.userId,
        title: item.title,
        content: item.content,
        type: item.type,
        metadata: item.metadata as Prisma.JsonObject | undefined,
      })),
    });
  }

  async findNotificationById(id: string) {
    return await this.prisma.inAppNotification.findUnique({
      where: { id },
    });
  }

  async findNotificationsByUserId(
    userId: string,
    options: {
      page: number;
      limit: number;
      type?: string;
      isRead?: boolean;
      isArchived?: boolean;
    }
  ) {
    const where: Prisma.InAppNotificationWhereInput = {
      userId,
    };

    if (options.type) {
      where.type = options.type;
    }

    if (options.isRead !== undefined) {
      where.isRead = options.isRead;
    }

    if (options.isArchived !== undefined) {
      where.isArchived = options.isArchived;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.inAppNotification.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.inAppNotification.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * Admin-only: list notifications across ALL users. Used by the
   * "Quản lý thông báo" page to see platform-wide activity.
   */
  async findAllForAdmin(options: {
    page: number;
    limit: number;
    search?: string;
    type?: string;
    isRead?: boolean;
    userId?: string;
    campaignsOnly?: boolean;
  }) {
    const where: Prisma.InAppNotificationWhereInput = {};
    if (options.type) where.type = options.type;
    if (options.isRead !== undefined) where.isRead = options.isRead;
    if (options.userId) where.userId = options.userId;
    if (options.search?.trim()) {
      const q = options.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ];
    }
    if (options.campaignsOnly) {
      where.metadata = { path: ["campaign"], equals: true };
    }

    const [notifications, total] = await Promise.all([
      this.prisma.inAppNotification.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.inAppNotification.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async markAsRead(id: string) {
    return await this.prisma.inAppNotification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string, type?: string) {
    const where: Prisma.InAppNotificationWhereInput = {
      userId,
      isRead: false,
    };

    if (type) {
      where.type = type;
    }

    return await this.prisma.inAppNotification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async archiveNotification(id: string) {
    return await this.prisma.inAppNotification.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  }

  async deleteNotification(id: string) {
    return await this.prisma.inAppNotification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string) {
    return await this.prisma.inAppNotification.count({
      where: {
        userId,
        isRead: false,
        isArchived: false,
      },
    });
  }

  async getNotificationStats(userId: string) {
    const [total, unread, byType] = await Promise.all([
      this.prisma.inAppNotification.count({ where: { userId } }),
      this.prisma.inAppNotification.count({ where: { userId, isRead: false } }),
      this.prisma.inAppNotification.groupBy({
        by: ["type"],
        where: { userId, isRead: false },
        _count: { type: true },
      }),
    ]);

    return {
      total,
      unread,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // ============== Notification Type Operations ==============

  async createNotificationType(data: { name: string; isLocked?: boolean }) {
    return await this.prisma.notificationType.create({
      data,
    });
  }

  async findNotificationTypeById(id: string) {
    return await this.prisma.notificationType.findUnique({
      where: { id },
    });
  }

  async findNotificationTypeByName(name: string) {
    return await this.prisma.notificationType.findUnique({
      where: { name },
    });
  }

  async findAllNotificationTypes() {
    return await this.prisma.notificationType.findMany({
      orderBy: { name: "asc" },
    });
  }

  async updateNotificationType(id: string, data: { name?: string; isLocked?: boolean }) {
    return await this.prisma.notificationType.update({
      where: { id },
      data,
    });
  }

  async deleteNotificationType(id: string) {
    return await this.prisma.notificationType.delete({
      where: { id },
    });
  }
}
