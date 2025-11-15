import type { Request, Response, NextFunction } from 'express';
import { NotificationService } from '@/modules/notifications/services/notification.service';

export class NotificationController {
  private notificationService = new NotificationService();

  // Notification Types Management
  public getNotificationTypes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notificationTypes = await this.notificationService.getNotificationTypes();
      
      res.status(200).json({
        success: true,
        message: 'Notification types retrieved successfully',
        data: notificationTypes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notification types',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public createNotificationType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, isLocked } = req.body;
      const newNotificationType = await this.notificationService.createNotificationType({
        name,
        isLocked
      });
      
      res.status(201).json({
        success: true,
        message: 'Notification type created successfully',
        data: newNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create notification type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public updateNotificationType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, isLocked } = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification type ID is required'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.updateNotificationType(id, {
        name,
        isLocked
      });
      
      res.status(200).json({
        success: true,
        message: 'Notification type updated successfully',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update notification type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public deleteNotificationType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification type ID is required'
        });
        return;
      }
      
      await this.notificationService.deleteNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Notification type deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public lockNotificationType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification type ID is required'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.lockNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Notification type locked successfully',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to lock notification type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public unlockNotificationType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification type ID is required'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.unlockNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Notification type unlocked successfully',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to unlock notification type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Notifications Management
  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const includeType = req.query.includeType === 'true';
      const includeUsers = req.query.includeUsers === 'true';

      const result = await this.notificationService.getNotifications({
        page,
        limit,
        includeType,
        includeUsers
      });
      
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getNotificationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      const includeUsers = req.query.includeUsers === 'true';
      const notification = await this.notificationService.getNotificationById(id, includeUsers);
      
      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Notification retrieved successfully',
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notification',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content, notificationTypeId, seen } = req.body;
      const newNotification = await this.notificationService.createNotification({
        title,
        content,
        notificationTypeId,
        seen
      });
      
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: newNotification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create notification',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public updateNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      const { title, content, notificationTypeId, seen } = req.body;
      const updatedNotification = await this.notificationService.updateNotification(id, {
        title,
        content,
        notificationTypeId,
        seen
      });
      
      res.status(200).json({
        success: true,
        message: 'Notification updated successfully',
        data: updatedNotification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update notification',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      await this.notificationService.deleteNotification(id);
      
      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getNotificationsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationTypeId } = req.params;
      
      if (!notificationTypeId) {
        res.status(400).json({
          success: false,
          message: 'Notification type ID is required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.notificationService.getNotificationsByType(notificationTypeId, {
        page,
        limit
      });
      
      res.status(200).json({
        success: true,
        message: 'Notifications by type retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications by type',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await this.notificationService.getNotificationsByUser(userId, {
        page,
        limit,
        unreadOnly
      });
      
      res.status(200).json({
        success: true,
        message: 'Notifications by user retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications by user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public markNotificationAsSeenForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationId, userId } = req.params;
      
      if (!notificationId || !userId) {
        res.status(400).json({
          success: false,
          message: 'Notification ID and User ID are required'
        });
        return;
      }
      
      await this.notificationService.markNotificationAsSeenForUser(notificationId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Notification marked as seen successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as seen',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public addNotificationToUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      const { userIds } = req.body;
      await this.notificationService.addNotificationToUsers(notificationId, userIds);
      
      res.status(200).json({
        success: true,
        message: 'Notification added to users successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add notification to users',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public removeNotificationFromUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      const { userIds } = req.body;
      await this.notificationService.removeNotificationFromUsers(notificationId, userIds);
      
      res.status(200).json({
        success: true,
        message: 'Notification removed from users successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove notification from users',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getNotificationStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.notificationService.getNotificationStats();
      
      res.status(200).json({
        success: true,
        message: 'Notification statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notification statistics',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // In-App Notifications Management
  public getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const unreadOnly = req.query.unreadOnly === 'true';
      const type = req.query.type as string;

      const result = await this.notificationService.getUserNotifications(userId, {
        page,
        limit,
        unreadOnly,
        type
      });
      
      res.status(200).json({
        success: true,
        message: 'User notifications retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user notifications',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      await this.notificationService.markNotificationAsRead(notificationId);
      
      res.status(200).json({
        success: true,
        message: 'Notification marked as read successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const result = await this.notificationService.markAllNotificationsAsRead(userId);
      
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public archiveNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(400).json({
          success: false,
          message: 'Notification ID is required'
        });
        return;
      }
      
      await this.notificationService.archiveNotification(notificationId);
      
      res.status(200).json({
        success: true,
        message: 'Notification archived successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to archive notification',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getUserNotificationStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const stats = await this.notificationService.getUserNotificationStats(userId);
      
      res.status(200).json({
        success: true,
        message: 'User notification statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user notification statistics',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public cleanupOldNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const daysOld = parseInt(req.query.daysOld as string) || 30;
      const result = await this.notificationService.cleanupOldNotifications(daysOld);
      
      res.status(200).json({
        success: true,
        message: 'Old notifications cleaned up successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup old notifications',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Course Update Notification
  public sendCourseUpdateNotification = async (
    req: Request<{ courseId: string }, {}, { title: string; content: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { title, content } = req.body;

      // Validate input
      if (!title || !content || title.trim() === '' || content.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Please fill in all notification information',
        });
        return;
      }

      const result = await this.notificationService.sendCourseUpdateNotifications(
        courseId,
        title.trim(),
        content.trim()
      );

      if (result.failedCount > 0 && result.sentCount > 0) {
        res.status(207).json({
          success: true,
          message: 'Notification delivery was incomplete, please check the logs',
          data: {
            sentCount: result.sentCount,
            failedCount: result.failedCount,
            details: result.details,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification has been sent successfully',
        data: {
          sentCount: result.sentCount,
          failedCount: result.failedCount,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Course not found') {
          res.status(404).json({
            success: false,
            message: 'Course not found',
          });
          return;
        }
        if (error.message === 'No students enrolled') {
          res.status(404).json({
            success: false,
            message: 'No students to send notification to',
          });
          return;
        }
      }
      next(error);
    }
  };
}
