// =============================================================================
// Notification Service - Business Logic Layer
// =============================================================================

import { NotificationRepository } from "../repositories/notification.repository.js";
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from "@capstone/common";
import type {
  CreateNotificationInput,
  CreateBulkNotificationInput,
  ListNotificationsQuery,
  CreateNotificationTypeInput,
  UpdateNotificationTypeInput,
  NotificationResponse,
  NotificationTypeResponse,
  NotificationStats,
} from "../dtos/notification.dto.js";

export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  // ============== In-App Notification Operations ==============

  async createNotification(input: CreateNotificationInput): Promise<NotificationResponse> {
    const notification = await this.repository.createNotification({
      userId: input.userId,
      title: input.title,
      content: input.content,
      type: input.type,
      contractId: input.contractId,
      courseId: input.courseId,
      metadata: input.metadata,
    });

    return this.mapNotificationResponse(notification);
  }

  async createBulkNotifications(input: CreateBulkNotificationInput): Promise<{ count: number }> {
    const notificationsData = input.userIds.map((userId) => ({
      userId,
      title: input.title,
      content: input.content,
      type: input.type,
      metadata: input.metadata,
    }));

    const result = await this.repository.createManyNotifications(notificationsData);

    return { count: result.count };
  }

  async getNotificationById(id: string, userId: string): Promise<NotificationResponse> {
    const notification = await this.repository.findNotificationById(id);

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You don't have access to this notification");
    }

    return this.mapNotificationResponse(notification);
  }

  async listNotifications(userId: string, query: ListNotificationsQuery) {
    const result = await this.repository.findNotificationsByUserId(userId, {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 20,
      type: query.type,
      isRead: query.isRead,
      isArchived: query.isArchived,
    });

    return {
      data: result.data.map((n) => this.mapNotificationResponse(n)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async markAsRead(id: string, userId: string): Promise<NotificationResponse> {
    const notification = await this.repository.findNotificationById(id);

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You don't have access to this notification");
    }

    if (notification.isRead) {
      return this.mapNotificationResponse(notification);
    }

    const updated = await this.repository.markAsRead(id);
    return this.mapNotificationResponse(updated);
  }

  async markAllAsRead(userId: string, type?: string): Promise<{ count: number }> {
    const result = await this.repository.markAllAsRead(userId, type);
    return { count: result.count };
  }

  async archiveNotification(id: string, userId: string): Promise<NotificationResponse> {
    const notification = await this.repository.findNotificationById(id);

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You don't have access to this notification");
    }

    const updated = await this.repository.archiveNotification(id);
    return this.mapNotificationResponse(updated);
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.repository.findNotificationById(id);

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("You don't have access to this notification");
    }

    await this.repository.deleteNotification(id);
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.repository.getUnreadCount(userId);
    return { count };
  }

  async getStats(userId: string): Promise<NotificationStats> {
    return await this.repository.getNotificationStats(userId);
  }

  // ============== Notification Type Operations (Admin) ==============

  async createNotificationType(input: CreateNotificationTypeInput): Promise<NotificationTypeResponse> {
    // Check if type already exists
    const existing = await this.repository.findNotificationTypeByName(input.name);
    if (existing) {
      throw new ConflictError(`Notification type '${input.name}' already exists`);
    }

    const notificationType = await this.repository.createNotificationType(input);
    return this.mapNotificationTypeResponse(notificationType);
  }

  async getNotificationTypes(): Promise<NotificationTypeResponse[]> {
    const types = await this.repository.findAllNotificationTypes();
    return types.map((t) => this.mapNotificationTypeResponse(t));
  }

  async updateNotificationType(id: string, input: UpdateNotificationTypeInput): Promise<NotificationTypeResponse> {
    const notificationType = await this.repository.findNotificationTypeById(id);

    if (!notificationType) {
      throw new NotFoundError("Notification type not found");
    }

    if (notificationType.isLocked && input.name) {
      throw new BadRequestError("Cannot modify a locked notification type");
    }

    // Check if new name conflicts with existing
    if (input.name && input.name !== notificationType.name) {
      const existing = await this.repository.findNotificationTypeByName(input.name);
      if (existing) {
        throw new ConflictError(`Notification type '${input.name}' already exists`);
      }
    }

    const updated = await this.repository.updateNotificationType(id, input);
    return this.mapNotificationTypeResponse(updated);
  }

  async deleteNotificationType(id: string): Promise<void> {
    const notificationType = await this.repository.findNotificationTypeById(id);

    if (!notificationType) {
      throw new NotFoundError("Notification type not found");
    }

    if (notificationType.isLocked) {
      throw new BadRequestError("Cannot delete a locked notification type");
    }

    await this.repository.deleteNotificationType(id);
  }

  // ============== Helper Methods ==============

  private mapNotificationResponse(notification: any): NotificationResponse {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.isRead,
      isArchived: notification.isArchived,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      archivedAt: notification.archivedAt,
      contractId: notification.contractId,
      courseId: notification.courseId,
      metadata: notification.metadata as Record<string, unknown> | null,
    };
  }

  private mapNotificationTypeResponse(notificationType: any): NotificationTypeResponse {
    return {
      id: notificationType.id,
      name: notificationType.name,
      isLocked: notificationType.isLocked,
    };
  }
}
