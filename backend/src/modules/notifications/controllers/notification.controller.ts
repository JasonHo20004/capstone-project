import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotificationService } from '@/modules/notifications/services/notification.service';
import {
  IN_APP_NOTIFICATION_CREATED_EVENT,
  notificationEvents,
  type InAppNotificationPayload,
} from '@/modules/notifications/services/notification.events';

export class NotificationController {
  private notificationService = new NotificationService();

  // Notification Types Management
  public getNotificationTypes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notificationTypes = await this.notificationService.getNotificationTypes();
      
      res.status(200).json({
        success: true,
        message: 'Lấy tất cả loại thông báo thành công',
        data: notificationTypes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy tất cả loại thông báo thất bại',
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
        message: 'Tạo loại thông báo thành công',
        data: newNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Tạo loại thông báo thất bại',
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
          message: 'ID loại thông báo là bắt buộc'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.updateNotificationType(id, {
        name,
        isLocked
      });
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật loại thông báo thành công',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Cập nhật loại thông báo thất bại',
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
          message: 'ID loại thông báo là bắt buộc'
        });
        return;
      }
      
      await this.notificationService.deleteNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa loại thông báo thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Xóa loại thông báo thất bại',
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
          message: 'ID loại thông báo là bắt buộc'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.lockNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Khoá loại thông báo thành công',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Khoá loại thông báo thất bại',
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
          message: 'ID loại thông báo là bắt buộc'
        });
        return;
      }
      
      const updatedNotificationType = await this.notificationService.unlockNotificationType(id);
      
      res.status(200).json({
        success: true,
        message: 'Mở khoá loại thông báo thành công',
        data: updatedNotificationType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Mở khoá loại thông báo thất bại',
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
        message: 'Lấy danh sách thông báo thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy danh sách thông báo thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      const includeUsers = req.query.includeUsers === 'true';
      const notification = await this.notificationService.getNotificationById(id, includeUsers);
      
      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Lấy thông báo thành công',
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thông báo thất bại',
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
        message: 'Tạo thông báo thành công',
        data: newNotification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Tạo thông báo thất bại',
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
          message: 'ID thông báo là bắt buộc'
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
        message: 'Cập nhật thông báo thành công',
        data: updatedNotification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Cập nhật thông báo thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      await this.notificationService.deleteNotification(id);
      
      res.status(200).json({
        success: true,
        message: 'Xóa thông báo thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Xóa thông báo thất bại',
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
        message: 'Lấy thông báo theo loại thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thông báo theo loại thất bại',
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
          message: 'ID người dùng là bắt buộc'
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
        message: 'Lấy thông báo theo người dùng thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thông báo theo người dùng thất bại',
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
          message: 'ID thông báo và ID người dùng là bắt buộc'
        });
        return;
      }
      
      await this.notificationService.markNotificationAsSeenForUser(notificationId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Đánh dấu thông báo đã đọc thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Đánh dấu thông báo đã đọc thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      const { userIds } = req.body;
      await this.notificationService.addNotificationToUsers(notificationId, userIds);
      
      res.status(200).json({
        success: true,
        message: 'Thêm thông báo vào người dùng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Thêm thông báo vào người dùng thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      const { userIds } = req.body;
      await this.notificationService.removeNotificationFromUsers(notificationId, userIds);
      
      res.status(200).json({
        success: true,
        message: 'Xóa thông báo khỏi người dùng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Xóa thông báo khỏi người dùng thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getNotificationStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.notificationService.getNotificationStats();
      
      res.status(200).json({
        success: true,
        message: 'Thống kê thông báo được lấy thành công',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thống kê thông báo thất bại',
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
          message: 'ID người dùng là bắt buộc'
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
        message: 'Lấy thông báo theo người dùng thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thông báo theo người dùng thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      await this.notificationService.markNotificationAsRead(notificationId);
      
      res.status(200).json({
        success: true,
        message: 'Thông báo đã được đánh dấu là đã đọc thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Đánh dấu thông báo đã đọc thất bại',
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
          message: 'ID người dùng là bắt buộc'
        });
        return;
      }
      
      const result = await this.notificationService.markAllNotificationsAsRead(userId);
      
      res.status(200).json({
        success: true,
        message: 'Tất cả thông báo đã được đánh dấu là đã đọc thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Đánh dấu tất cả thông báo đã đọc thất bại',
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
          message: 'ID thông báo là bắt buộc'
        });
        return;
      }
      
      await this.notificationService.archiveNotification(notificationId);
      
      res.status(200).json({
        success: true,
        message: 'Thông báo đã được lưu trữ thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lưu trữ thông báo thất bại',
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
          message: 'ID người dùng là bắt buộc'
        });
        return;
      }
      
      const stats = await this.notificationService.getUserNotificationStats(userId);
      
      res.status(200).json({
        success: true,
        message: 'Thống kê thông báo theo người dùng được lấy thành công',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy thống kê thông báo theo người dùng thất bại',
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
        message: 'Công việc xóa thông báo cũ đã hoàn thành thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Xóa thông báo cũ thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  /**
   * Server-Sent Events stream for real-time in-app notifications
   * Authenticates using ?token=<JWT> query param
   */
  public streamUserNotifications = (req: Request, res: Response): void => {
    try {
      const token = (req.query.token as string) || '';

      if (!token) {
        res.status(401).json({ success: false, message: 'Thiếu access token' });
        return;
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
        res.status(500).json({ success: false, message: 'JWT secret không được cấu hình' });
        return;
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
        return;
      }

      const userId = decoded?.userId as string | undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Token không có userId' });
        return;
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      (res as any).flushHeaders?.();

      const sendEvent = (payload: InAppNotificationPayload) => {
        if (payload.userId !== userId) return;
        const data = JSON.stringify(payload);
        res.write(`event: notification\n`);
        res.write(`data: ${data}\n\n`);
      };

      // Initial heartbeat
      res.write(`event: ping\n`);
      res.write(`data: "connected"\n\n`);

      notificationEvents.on(IN_APP_NOTIFICATION_CREATED_EVENT, sendEvent);

      req.on('close', () => {
        notificationEvents.off(IN_APP_NOTIFICATION_CREATED_EVENT, sendEvent);
        res.end();
      });
    } catch (error) {
      // If anything goes wrong, just close the stream
      res.end();
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
          message: 'Vui lòng nhập đầy đủ thông tin cập nhật khóa học',
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
          message: 'Gửi thông báo cập nhật khóa học không hoàn toàn thành công, vui lòng kiểm tra logs',
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
        message: 'Thông báo cập nhật khóa học đã được gửi thành công',
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
            message: 'Không tìm thấy khóa học',
          });
          return;
        }
        if (error.message === 'No students enrolled') {
          res.status(404).json({
            success: false,
            message: 'Không có người dùng nào đăng ký khóa học này',
          });
          return;
        }
      }
      next(error);
    }
  };
}
