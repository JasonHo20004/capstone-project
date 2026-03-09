// =============================================================================
// Course Controller - HTTP handlers for course endpoints
// =============================================================================

import { Request, Response } from "express";
import { CourseService } from "../services/course.service.js";
import { asyncHandler, NotFoundError, ForbiddenError } from "@capstone/common";

export class CourseController {
  private courseService = new CourseService();

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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
    const { sellerId } = req.params;
    const query = req.query as any;
    const result = await this.courseService.getMany({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      category: query.category,
      level: query.level,
      sellerId,
      status: "PUBLISHED",
    });

    res.json({ success: true, ...result });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const course = await this.courseService.create(sellerId, req.body);
    
    res.status(201).json({ success: true, data: course });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;
    const course = await this.courseService.update(id, sellerId, req.body);
    
    res.json({ success: true, data: course });
  });

  publish = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;
    const course = await this.courseService.publish(id, sellerId);
    
    res.json({ success: true, data: course, message: "Course published successfully" });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sellerId = req.user!.userId;
    await this.courseService.delete(id, sellerId);
    
    res.json({ success: true, message: "Course deleted successfully" });
  });

  getEnrolled = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const courses = await this.courseService.getEnrolledCourses(userId);
    res.json({ success: true, data: courses });
  });
}
