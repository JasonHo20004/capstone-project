// =============================================================================
// Notification Routes - Express Router Configuration
// =============================================================================

import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authenticateToken, requireAdmin, validate } from "@capstone/common";
import {
  createNotificationSchema,
  createBulkNotificationSchema,
  getNotificationSchema,
  listNotificationsSchema,
  markAsReadSchema,
  markAllAsReadSchema,
  archiveNotificationSchema,
  createNotificationTypeSchema,
  updateNotificationTypeSchema,
} from "../dtos/notification.dto.js";

const router: Router = Router();
const controller = new NotificationController();

// ============== User Notification Routes ==============

// Protected: List user's notifications
router.get("/", authenticateToken, validate(listNotificationsSchema), controller.listNotifications);

// Protected: Get unread count
router.get("/unread-count", authenticateToken, controller.getUnreadCount);

// Protected: Get notification stats
router.get("/stats", authenticateToken, controller.getStats);

// Protected: Get single notification
router.get("/:id", authenticateToken, validate(getNotificationSchema), controller.getNotification);

// Protected: Mark notification as read
router.patch("/:id/read", authenticateToken, validate(markAsReadSchema), controller.markAsRead);

// Protected: Mark all notifications as read
router.post("/read-all", authenticateToken, validate(markAllAsReadSchema), controller.markAllAsRead);

// Protected: Archive notification
router.patch("/:id/archive", authenticateToken, validate(archiveNotificationSchema), controller.archiveNotification);

// Protected: Delete notification
router.delete("/:id", authenticateToken, validate(getNotificationSchema), controller.deleteNotification);

// ============== Internal API Routes (Service-to-Service) ==============

// Internal: Create notification for a user (called by other services)
router.post("/internal/create", validate(createNotificationSchema), controller.createNotification);

// Internal: Create bulk notifications
router.post("/internal/bulk", validate(createBulkNotificationSchema), controller.createBulkNotifications);

// ============== Admin Routes ==============

// Admin: List notification types
router.get("/types", authenticateToken, requireAdmin, controller.listNotificationTypes);

// Admin: Create notification type
router.post("/types", authenticateToken, requireAdmin, validate(createNotificationTypeSchema), controller.createNotificationType);

// Admin: Update notification type
router.patch("/types/:id", authenticateToken, requireAdmin, validate(updateNotificationTypeSchema), controller.updateNotificationType);

// Admin: Delete notification type
router.delete("/types/:id", authenticateToken, requireAdmin, controller.deleteNotificationType);

export default router;
