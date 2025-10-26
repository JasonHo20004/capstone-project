import type { Request, Response, NextFunction } from 'express';
import { CourseService } from '@/modules/courses/services/course.service';
import type {
  CreateCourseInput,
  UpdateCourseInput,
  PublishCourseInput,
  GetCourseByIdInput,
  GetCoursesBySellerInput,
} from '../dtos/course.dto';

export class CourseController {
  private courseService = new CourseService();

  public createCourse = async (
    req: Request<{}, CreateCourseInput['body'], CreateCourseInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseData = req.body;
      // Get course seller ID from authenticated user (assume it's in req.user after auth middleware)
      const courseSellerId = (req as any).user?.id;
      
      if (!courseSellerId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const newCourse = await this.courseService.createCourse({
        ...courseData,
        courseSellerId,
      });

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (
    req: Request<UpdateCourseInput['params'], {}, UpdateCourseInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const updateData = req.body;

      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public publishCourse = async (
    req: Request<PublishCourseInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const publishedCourse = await this.courseService.publishCourse(courseId);

      res.status(200).json({
        success: true,
        message: 'Course published successfully',
        data: publishedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (
    req: Request<GetCourseByIdInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getCourseById(courseId);

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Course retrieved successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCoursesBySeller = async (
    req: Request<GetCoursesBySellerInput['params'], {}, {}, GetCoursesBySellerInput['query']>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sellerId } = req.params;
      const { status } = req.query;

      const courses = await this.courseService.getCoursesBySeller(sellerId);

      const filteredCourses = status
        ? courses.filter((c) => c.status === status)
        : courses;

      res.status(200).json({
        success: true,
        message: 'Courses retrieved successfully',
        data: filteredCourses,
        count: filteredCourses.length,
      });
    } catch (error) {
      next(error);
    }
  };
}

