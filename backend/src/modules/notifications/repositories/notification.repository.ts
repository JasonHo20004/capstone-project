import { databaseService } from "@/services/database.service";
import { type CreateNotificationDto, type UpdateNotificationDto } from "../dtos/notification.dto";

export class NotificationRepository {
  private prisma = databaseService.getClient();

  /**
   * Create a new notification
   */
  async create(data: CreateNotificationDto) {
    return await this.prisma.notification.create({
      data: {
        title: data.title,
        content: data.content,
        notificationTypeId: data.notificationTypeId,
        seen: data.seen || false
      },
      include: {
        notificationType: true
      }
    });
  }

  /**
   * Get all notifications with pagination
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    includeType?: boolean;
    includeUsers?: boolean;
  } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const include: any = {};
    if (options.includeType) {
      include.notificationType = true;
    }
    if (options.includeUsers) {
      include.userNotifications = {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        }
      };
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        include,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.notification.count()
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
   * Get notification by ID
   */
  async findById(id: string, includeUsers: boolean = false) {
    const include: any = {
      notificationType: true
    };

    if (includeUsers) {
      include.userNotifications = {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        }
      };
    }

    return await this.prisma.notification.findUnique({
      where: { id },
      include
    });
  }

  /**
   * Update notification
   */
  async update(id: string, data: UpdateNotificationDto) {
    return await this.prisma.notification.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.notificationTypeId && { notificationTypeId: data.notificationTypeId }),
        ...(data.seen !== undefined && { seen: data.seen })
      },
      include: {
        notificationType: true
      }
    });
  }

  /**
   * Delete notification
   */
  async delete(id: string) {
    return await this.prisma.notification.delete({
      where: { id }
    });
  }

  /**
   * Get notifications by type
   */
  async findByType(notificationTypeId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { notificationTypeId },
        include: {
          notificationType: true,
          userNotifications: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.notification.count({
        where: { notificationTypeId }
      })
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
   * Get notifications by user
   */
  async findByUser(userId: string, options: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      userNotifications: {
        some: {
          userId
        }
      }
    };

    if (options.unreadOnly) {
      where.seen = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        include: {
          notificationType: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.notification.count({ where })
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
   * Mark notification as seen for a specific user
   */
  async markAsSeenForUser(notificationId: string, userId: string) {
    const userNotification = await this.prisma.userNotification.findUnique({
      where: {
        notificationId_userId: {
          notificationId,
          userId
        }
      }
    });

    if (!userNotification) {
      throw new Error('Người dùng không có thông báo này');
    }

    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { seen: true }
    });
  }

  /**
   * Add notification to users
   */
  async addToUsers(notificationId: string, userIds: string[]) {
    const userNotifications = userIds.map(userId => ({
      notificationId,
      userId
    }));

    return await this.prisma.userNotification.createMany({
      data: userNotifications,
      skipDuplicates: true
    });
  }

  /**
   * Remove notification from users
   */
  async removeFromUsers(notificationId: string, userIds: string[]) {
    return await this.prisma.userNotification.deleteMany({
      where: {
        notificationId,
        userId: {
          in: userIds
        }
      }
    });
  }

  /**
   * Get notification stats
   */
  async getStats() {
    const [total, byTypeRaw, bySeenStatus] = await Promise.all([
      this.prisma.notification.count(),
      this.prisma.notification.groupBy({
        by: ['notificationTypeId'],
        _count: {
          id: true
        }
      }),
      this.prisma.notification.groupBy({
        by: ['seen'],
        _count: {
          id: true
        }
      })
    ]);

    // Fetch names for the grouped notificationTypeIds
    const typeIds = byTypeRaw.map(item => item.notificationTypeId).filter(Boolean) as string[];
    const types = typeIds.length
      ? await this.prisma.notificationType.findMany({
          where: { id: { in: typeIds } },
          select: { id: true, name: true }
        })
      : [];
    const typeNameMap = new Map(types.map(t => [t.id, t.name]));

    return {
      total,
      byType: byTypeRaw.map(item => ({
        typeId: item.notificationTypeId,
        typeName: typeNameMap.get(item.notificationTypeId) || 'Unknown',
        count: item._count.id
      })),
      bySeenStatus: bySeenStatus.map(item => ({
        seen: item.seen,
        count: item._count.id
      }))
    };
  }
}