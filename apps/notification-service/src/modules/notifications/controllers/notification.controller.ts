// =============================================================================
// Notification Controller - HTTP Handlers
// =============================================================================

import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service.js";
import { NotificationRepository } from "../repositories/notification.repository.js";
import { asyncHandler } from "@capstone/common";
import { emailService } from "../../../services/index.js";

export class NotificationController {
  private service: NotificationService;

  constructor() {
    this.service = new NotificationService(new NotificationRepository());
  }

  // ============== User Notification Endpoints ==============

  listNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const q = req.query as Record<string, string | undefined>;
    const toBool = (v: string | undefined) =>
      v === "true" ? true : v === "false" ? false : undefined;
    const result = await this.service.listNotifications(userId, {
      page: q.page,
      limit: q.limit,
      type: q.type,
      isRead: toBool(q.isRead),
      isArchived: toBool(q.isArchived),
    } as any);

    res.json({ success: true, ...result });
  });

  /** Admin-only: platform-wide notification list. */
  listAllForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const q = req.query as Record<string, string | undefined>;
    const result = await this.service.listAllForAdmin({
      page: q.page,
      limit: q.limit,
      search: q.search,
      type: q.type,
      isRead:
        q.isRead === "true" ? true : q.isRead === "false" ? false : undefined,
      userId: q.userId,
      campaignsOnly: q.campaignsOnly === "true",
    });
    res.json({ success: true, ...result });
  });

  getNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const notification = await this.service.getNotificationById(id as string, userId);

    res.json({ success: true, data: notification });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const notification = await this.service.markAsRead(id as string, userId);

    res.json({
      success: true,
      data: notification,
      message: "Notification marked as read",
    });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { type } = req.body;
    const result = await this.service.markAllAsRead(userId, type);

    res.json({
      success: true,
      data: result,
      message: `${result.count} notifications marked as read`,
    });
  });

  archiveNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const notification = await this.service.archiveNotification(id as string, userId);

    res.json({
      success: true,
      data: notification,
      message: "Notification archived",
    });
  });

  unarchiveNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const notification = await this.service.unarchiveNotification(id as string, userId);

    res.json({
      success: true,
      data: notification,
      message: "Notification unarchived",
    });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    await this.service.deleteNotification(id as string, userId);

    res.json({ success: true, message: "Notification deleted" });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.getUnreadCount(userId);

    res.json({ success: true, data: result });
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const stats = await this.service.getStats(userId);

    res.json({ success: true, data: stats });
  });

  // ============== Internal/Service Endpoints (for other microservices) ==============

  createNotification = asyncHandler(async (req: Request, res: Response) => {
    const notification = await this.service.createNotification(req.body);

    res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created",
    });
  });

  // Internal: send a transactional email (called by other services). Reuses
  // the shared SMTP transport so callers don't need their own mailer.
  sendEmail = asyncHandler(async (req: Request, res: Response) => {
    const { to, subject, html } = req.body as { to: string; subject: string; html: string };
    await emailService.sendMail({ to, subject, html });

    res.status(200).json({ success: true, message: "Email sent" });
  });

  createBulkNotifications = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createBulkNotifications(req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: `${result.count} notifications created`,
    });
  });

  // ============== Admin Endpoints ==============

  listNotificationTypes = asyncHandler(async (_req: Request, res: Response) => {
    const types = await this.service.getNotificationTypes();

    res.json({ success: true, data: types });
  });

  createNotificationType = asyncHandler(async (req: Request, res: Response) => {
    const notificationType = await this.service.createNotificationType(req.body);

    res.status(201).json({
      success: true,
      data: notificationType,
      message: "Notification type created",
    });
  });

  updateNotificationType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notificationType = await this.service.updateNotificationType(id as string, req.body);

    res.json({
      success: true,
      data: notificationType,
      message: "Notification type updated",
    });
  });

  deleteNotificationType = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.deleteNotificationType(id as string);

    res.json({ success: true, message: "Notification type deleted" });
  });
}
