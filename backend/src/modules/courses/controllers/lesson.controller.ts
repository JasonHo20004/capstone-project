import type { Request, Response, NextFunction } from 'express';
import { LessonService } from '@/modules/courses/services/lesson.service';
import type {
  CreateLessonInput,
  UpdateLessonInput,
  GetLessonByIdInput,
} from '../dtos/lesson.dto';

export class LessonController {
  private lessonService = new LessonService();

  public createLesson = async (
    req: Request<CreateLessonInput['params'], {}, CreateLessonInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const lessonData = req.body;
      
      // Access the uploaded file information from multer
      const file = (req as any).file;
      
      // Get video URL from S3 upload
      const videoUrl = file?.location || file?.key;

      const newLesson = await this.lessonService.createLesson({
        courseId,
        ...lessonData,
        videoUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: newLesson,
      });
    } catch (error) {
      // If error is about video upload, return specific error
      if (error instanceof Error && error.message.includes('upload video')) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
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
      const { courseId, lessonId } = req.params;
      const updateData = req.body;

      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Lesson updated successfully',
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
      const { courseId, lessonId } = req.params;

      const lesson = await this.lessonService.getLessonById(lessonId);

      if (!lesson) {
        res.status(404).json({
          success: false,
          message: 'Lesson not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lesson retrieved successfully',
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
        message: 'Lessons retrieved successfully',
        data: lessons,
        count: lessons.length,
      });
    } catch (error) {
      next(error);
    }
  };
}

