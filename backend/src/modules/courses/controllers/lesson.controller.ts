import type { Request, Response, NextFunction } from 'express';
import { LessonService } from '@/modules/courses/services/lesson.service';
import { CourseRepository } from '@/modules/courses/repositories/course.repository';
import { UserRole } from '@prisma/client';
import type {
  CreateLessonInput,
  UpdateLessonInput,
  GetLessonByIdInput,
} from '../dtos/lesson.dto';

export class LessonController {
  private lessonService = new LessonService();
  private courseRepository = new CourseRepository();

  public createLesson = async (
    req: Request<CreateLessonInput['params'], {}, CreateLessonInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const lessonData = req.body;
      const file = (req as any).file;
      const videoUrl = file?.location || file?.key;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      // Check if user is authenticated
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Chưa có quyền truy cập',
        });
        return;
      }

      // Check if course exists and verify ownership (unless admin)
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Khoá học không tồn tại',
        });
        return;
      }

      // Verify seller owns the course (admins can bypass)
      if (userRole !== UserRole.ADMINISTRATOR && course.courseSellerId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền tạo bài giảng cho khoá học này',
        });
        return;
      }

      const createData: {
        courseId: string;
        title: string;
        description?: string;
        lessonOrder?: number;
        durationInSeconds?: number;
        videoUrl?: string;
      } = {
        courseId,
        title: lessonData.title,
      };

      if (lessonData.description !== undefined) {
        createData.description = lessonData.description;
      }
      if (lessonData.lessonOrder !== undefined) {
        createData.lessonOrder = lessonData.lessonOrder;
      }
      if (lessonData.durationInSeconds !== undefined) {
        createData.durationInSeconds = lessonData.durationInSeconds;
      }
      if (videoUrl !== undefined) {
        createData.videoUrl = videoUrl;
      }

      const newLesson = await this.lessonService.createLesson(createData);

      res.status(201).json({
        success: true,
        message: 'Bài giảng đã được tạo thành công',
        data: newLesson,
      });
    } catch (error) {
      // Handle S3 connection/upload errors
      if (error instanceof Error) {
        const errorMessage = error.message || '';
        
        // S3 connection errors
        if (
          errorMessage.includes('getaddrinfo') ||
          errorMessage.includes('EAI_AGAIN') ||
          errorMessage.includes('ENOTFOUND') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('ETIMEDOUT') ||
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('socket hang up')
        ) {
          res.status(503).json({
            success: false,
            message: 'Không thể kết nối đến dịch vụ lưu trữ file. Vui lòng kiểm tra cấu hình AWS S3 hoặc thử lại sau.',
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          });
          return;
        }

        // AWS authentication errors
        if (
          errorMessage.includes('InvalidAccessKeyId') ||
          errorMessage.includes('SignatureDoesNotMatch') ||
          errorMessage.includes('AccessDenied')
        ) {
          res.status(503).json({
            success: false,
            message: 'Lỗi xác thực dịch vụ lưu trữ file. Vui lòng kiểm tra cấu hình AWS S3.',
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          });
          return;
        }

        // General upload errors
        if (errorMessage.includes('upload video') || errorMessage.includes('upload')) {
          res.status(400).json({
            success: false,
            message: errorMessage,
          });
          return;
        }
      }
      next(error);
    }
  };

  public updateLesson = async (
    req: Request<UpdateLessonInput['params'], {}, UpdateLessonInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId: _courseId, lessonId } = req.params;
      const updateData = req.body;
      const updatePayload: {
        title?: string;
        description?: string;
        lessonOrder?: number;
        durationInSeconds?: number;
      } = {};

      if (updateData.title !== undefined) {
        updatePayload.title = updateData.title;
      }
      if (updateData.description !== undefined) {
        updatePayload.description = updateData.description;
      }
      if (updateData.lessonOrder !== undefined) {
        updatePayload.lessonOrder = updateData.lessonOrder;
      }
      if (updateData.durationInSeconds !== undefined) {
        updatePayload.durationInSeconds = updateData.durationInSeconds;
      }

      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        updatePayload
      );

      res.status(200).json({
        success: true,
        message: 'Bài giảng đã được cập nhật thành công',
        data: updatedLesson,
      });
    } catch (error) {
      next(error);
    }
  };

  public getLessonById = async (
    req: Request<GetLessonByIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId: _courseId, lessonId } = req.params;

      const lesson = await this.lessonService.getLessonById(lessonId);

      if (!lesson) {
        res.status(404).json({
          success: false,
          message: 'Bài giảng không tồn tại',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Bài giảng đã được lấy thành công',
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  };

  public getLessonsByCourse = async (
    req: Request<{ courseId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const lessons = await this.lessonService.getLessonsByCourse(courseId);

      res.status(200).json({
        success: true,
        message: 'Danh sách bài giảng đã được lấy thành công',
        data: lessons,
        count: lessons.length,
      });
    } catch (error) {
      next(error);
    }
  };
}

