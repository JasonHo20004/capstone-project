import type { Request, Response } from 'express';
import { CourseManagementService } from '@/modules/course-management/services/course-management.service';

export class CourseManagementController {
  private service = new CourseManagementService();

  public getAllCourses = async (_req: Request, res: Response): Promise<void> => {
    try {
      const courses = await this.service.getAllCourses();
      res.status(200).json({
        success: true,
        message: 'Get all courses successfully',
        data: courses,
        count: courses.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get courses',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }
      const course = await this.service.getCourseById(id);
      res.status(200).json({
        success: true,
        message: 'Get course details successfully',
        data: course
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get course details',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getCourseLessons = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }
      const data = await this.service.getCourseLessons(id);
      res.status(200).json({
        success: true,
        message: 'Get course lessons successfully',
        data
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get course lessons',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getSpecificLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: 'Course ID and Lesson ID are required'
        });
        return;
      }
      const data = await this.service.getSpecificLesson(courseId, lessonId);
      res.status(200).json({
        success: true,
        message: 'Get lesson successfully',
        data
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      if (error instanceof Error && error.message === 'Lesson not found') {
        res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get lesson',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: 'Course ID and Lesson ID are required'
        });
        return;
      }
      const data = await this.service.updateLesson(courseId, lessonId, req.body);
      res.status(200).json({
        success: true,
        message: 'Update lesson successfully',
        data
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      if (error instanceof Error && error.message === 'Lesson not found') {
        res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update lesson',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public deleteLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      console.log("courseId, lessonId::::::::", courseId, lessonId);
      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: 'Course ID and Lesson ID are required'
        });
        return;
      }
      await this.service.deleteLesson(courseId, lessonId);
      res.status(200).json({
        success: true,
        message: 'Delete lesson successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      if (error instanceof Error && error.message === 'Lesson not found') {
        res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete lesson',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId, commentId } = req.params;
      if (!courseId || !lessonId || !commentId) {
        res.status(400).json({
          success: false,
          message: 'Course ID, Lesson ID, and Comment ID are required'
        });
        return;
      }
      await this.service.deleteComment(courseId, lessonId, commentId);
      res.status(200).json({
        success: true,
        message: 'Delete comment successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      if (error instanceof Error && error.message === 'Lesson not found') {
        res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
        return;
      }
      if (error instanceof Error && error.message === 'Comment not found') {
        res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete comment',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getCourseRatings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }
      const data = await this.service.getCourseRatings(id);
      res.status(200).json({
        success: true,
        message: 'Get course ratings successfully',
        data
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to get course ratings',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }
      const course = await this.service.updateCourse(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update course',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
