import { Router } from 'express';
import { NotificationController } from '@/modules/notifications/controllers/notification.controller';

const router = Router();
const notificationController = new NotificationController();

// Notification Types Management
router.get('/types', notificationController.getNotificationTypes);
router.post('/types', notificationController.createNotificationType);
router.put('/types/:id', notificationController.updateNotificationType);
router.delete('/types/:id', notificationController.deleteNotificationType);
router.post('/types/:id/lock', notificationController.lockNotificationType);
router.post('/types/:id/unlock', notificationController.unlockNotificationType);

// Notifications Management
router.get('/', notificationController.getNotifications);
router.get('/stats', notificationController.getNotificationStats);
router.get('/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

// Notifications by Type
router.get('/type/:notificationTypeId', notificationController.getNotificationsByType);

// Notifications by User
router.get('/user/:userId', notificationController.getNotificationsByUser);
router.post('/:notificationId/user/:userId/mark-seen', notificationController.markNotificationAsSeenForUser);

// Notification User Management
router.post('/:notificationId/users', notificationController.addNotificationToUsers);
router.delete('/:notificationId/users', notificationController.removeNotificationFromUsers);

// In-App Notifications
router.get('/in-app/user/:userId', notificationController.getUserNotifications);
router.post('/in-app/:notificationId/read', notificationController.markNotificationAsRead);
router.post('/in-app/user/:userId/mark-all-read', notificationController.markAllNotificationsAsRead);
router.post('/in-app/:notificationId/archive', notificationController.archiveNotification);
router.get('/in-app/user/:userId/stats', notificationController.getUserNotificationStats);

// Maintenance
router.delete('/cleanup', notificationController.cleanupOldNotifications);

export default router;
