// =============================================================================
// Notification Routes - Express Router Configuration
// =============================================================================

import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { CampaignController } from "../controllers/campaign.controller.js";
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
const campaignController = new CampaignController();

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

// Protected: Unarchive notification (restore from saved list back to active inbox)
router.patch("/:id/unarchive", authenticateToken, validate(archiveNotificationSchema), controller.unarchiveNotification);

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

// Admin: Targeted campaign — fan out a single payload to a recipient segment
router.post("/admin/campaign", authenticateToken, requireAdmin, campaignController.run);
router.post("/admin/campaign/preview", authenticateToken, requireAdmin, campaignController.preview);

// Admin: Platform-wide notification feed (not scoped to admin's own inbox)
router.get("/admin/all", authenticateToken, requireAdmin, controller.listAllForAdmin);

export default router;
