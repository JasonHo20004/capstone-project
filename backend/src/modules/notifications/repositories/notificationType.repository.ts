import { databaseService } from "@/services/database.service";
import { type CreateNotificationTypeDto, type UpdateNotificationTypeDto } from "../dtos/notificationType.dto";

export class NotificationTypeRepository {
  private prisma = databaseService.getClient();

  /**
   * Create a new notification type
   */
  async create(data: CreateNotificationTypeDto) {
    return await this.prisma.notificationType.create({
      data: {
        name: data.name,
        isLocked: data.isLocked || false
      }
    });
  }

  /**
   * Get all notification types
   */
  async findAll() {
    return await this.prisma.notificationType.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Get notification type by ID
   */
  async findById(id: string) {
    return await this.prisma.notificationType.findUnique({
      where: { id },
      include: {
        notifications: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            seen: true
          }
        }
      }
    });
  }

  /**
   * Get notification type by name
   */
  async findByName(name: string) {
    return await this.prisma.notificationType.findUnique({
      where: { name }
    });
  }

  /**
   * Update notification type
   */
  async update(id: string, data: UpdateNotificationTypeDto) {
    return await this.prisma.notificationType.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.isLocked !== undefined && { isLocked: data.isLocked })
      }
    });
  }

  /**
   * Delete notification type (only if not locked and no notifications exist)
   */
  async delete(id: string) {
    // Check if notification type is locked
    const notificationType = await this.prisma.notificationType.findUnique({
      where: { id },
      include: {
        notifications: {
          select: { id: true }
        }
      }
    });

    if (!notificationType) {
      throw new Error('Không tìm thấy loại thông báo');
    }

    if (notificationType.isLocked) {
      throw new Error('Không thể xóa loại thông báo đã khóa');
    }

    if (notificationType.notifications.length > 0) {
      throw new Error('Không thể xóa loại thông báo đang có thông báo liên kết');
    }

    return await this.prisma.notificationType.delete({
      where: { id }
    });
  }

  /**
   * Get notification types with notification counts
   */
  async findWithNotificationCounts() {
    return await this.prisma.notificationType.findMany({
      include: {
        _count: {
          select: {
            notifications: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Lock a notification type (prevent deletion)
   */
  async lock(id: string) {
    return await this.prisma.notificationType.update({
      where: { id },
      data: { isLocked: true }
    });
  }

  /**
   * Unlock a notification type
   */
  async unlock(id: string) {
    return await this.prisma.notificationType.update({
      where: { id },
      data: { isLocked: false }
    });
  }
}