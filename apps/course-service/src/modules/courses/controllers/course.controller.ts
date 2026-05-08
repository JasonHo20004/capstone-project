// =============================================================================
// Course Controller - HTTP handlers for course endpoints
// =============================================================================

import { Request, Response } from "express";
import { CourseService } from "../services/course.service.js";
import { asyncHandler, NotFoundError, ForbiddenError } from "@capstone/common";
import { s3Service } from "../../../services/s3.service.js";

export class CourseController {
  private courseService = new CourseService();


  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await this.courseService.getById(id);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    res.json({ success: true, data: course });
  });

  getMany = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as any;
    const result = await this.courseService.getMany({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      category: query.category,
      level: query.level,
      status: query.status,
    });

    res.json({ success: true, ...result });
  });

  getPublished = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as any;
    const result = await this.courseService.getPublishedCourses({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      category: query.category,
      level: query.level,
    });

    res.json({ success: true, ...result });
  });

  getMyCourses = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const query = req.query as any;
    const result = await this.courseService.getMyCourses(sellerId, {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
    });

    res.json({ success: true, ...result });
  });

  /** Get courses by seller ID (public - returns published courses only) */
  getBySellerId = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.params.sellerId as string;
    const query = req.query as any;
    const result = await this.courseService.getMany({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      category: query.category,
      level: query.level,
      sellerId,
      status: "ACTIVE",
    });

    res.json({ success: true, ...result });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const course = await this.courseService.create(sellerId, req.body);
    
    res.status(201).json({ success: true, data: course });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const sellerId = req.user!.userId;
    const course = await this.courseService.update(id, sellerId, req.body);
    
    res.json({ success: true, data: course });
  });

  publish = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const sellerId = req.user!.userId;
    const course = await this.courseService.publish(id, sellerId);
    
    res.json({ success: true, data: course, message: "Course published successfully" });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const sellerId = req.user!.userId;
    await this.courseService.delete(id, sellerId);
    
    res.json({ success: true, message: "Course deleted successfully" });
  });

  getEnrolled = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const courses = await this.courseService.getEnrolledCourses(userId);
    res.json({ success: true, data: courses });
  });

  setFinalTest = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const sellerId = req.user!.userId;
    const { testId } = req.body;

    if (!testId) {
      res.status(400).json({ success: false, message: "testId is required" });
      return;
    }

    await this.courseService.setFinalTest(id, sellerId, testId);
    res.json({ success: true, message: "Final test linked successfully" });
  });

  removeFinalTest = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const sellerId = req.user!.userId;
    await this.courseService.removeFinalTest(id, sellerId);
    res.json({ success: true, message: "Final test removed successfully" });
  });

  createLesson = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const sellerId = req.user!.userId;
    const { title, description, durationInSeconds, lessonOrder, moduleId } = req.body;

    let videoUrl: string | undefined;
    if (req.file) {
      videoUrl = await s3Service.uploadFile(req.file, "course-videos");
    }

    try {
      const lesson = await this.courseService.createLesson(courseId, sellerId, {
        title,
        description,
        durationInSeconds: durationInSeconds ? parseFloat(durationInSeconds) : undefined,
        lessonOrder: lessonOrder ? parseInt(lessonOrder) : undefined,
        moduleId: moduleId || undefined,
        videoUrl,
      });
      res.status(201).json({ success: true, data: lesson });
    } catch (err) {
      console.error("[CourseController] createLesson DB error:", err);
      if (videoUrl) {
        s3Service.deleteFile(videoUrl).catch((cleanupErr) =>
          console.error("[CourseController] S3 cleanup failed after DB error:", cleanupErr)
        );
      }
      throw err;
    }
  });

  getLessonById = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const lessonId = req.params.lessonId as string;
    const lesson = await this.courseService.getLessonById(courseId, lessonId);
    res.json({ success: true, data: lesson });
  });

  updateLesson = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id as string;
    const lessonId = req.params.lessonId as string;
    const sellerId = req.user!.userId;
    const { title, description, durationInSeconds, lessonOrder, materials } = req.body;

    // Upload video to S3 if a new file was provided
    let videoUrl: string | undefined;
    if ((req as any).file) {
      videoUrl = await s3Service.uploadFile((req as any).file, "course-videos");
    }

    const lesson = await this.courseService.updateLesson(courseId, lessonId, sellerId, {
      title: title || undefined,
      description: description !== undefined ? description : undefined,
      durationInSeconds: durationInSeconds ? parseFloat(durationInSeconds) : undefined,
      lessonOrder: lessonOrder ? parseInt(lessonOrder) : undefined,
      materials: materials ? (typeof materials === 'string' ? JSON.parse(materials) : materials) : undefined,
      videoUrl,
    });

    res.json({ success: true, data: lesson });
  });
}
