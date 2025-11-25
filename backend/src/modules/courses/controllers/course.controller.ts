import type { Request, Response, NextFunction } from "express";
import { CourseService } from "@/modules/courses/services/course.service";
import type {
  CreateCourseInput,
  UpdateCourseInput,
  PublishCourseInput,
  GetCourseByIdInput,
  GetCoursesBySellerInput,
  GetCoursesInput,
} from "../dtos/course.dto";

export class CourseController {
  private courseService = new CourseService();

  public createCourse = async (
    req: Request<{}, CreateCourseInput["body"], CreateCourseInput["body"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseData = req.body;
      const courseSellerId = (req as any).user?.userId;

      if (!courseSellerId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const payload = {
        title: courseData.title,
        price: courseData.price,
        courseSellerId,
        ...(courseData.description !== undefined && {
          description: courseData.description,
        }),
        ...(courseData.category !== undefined && {
          category: courseData.category,
        }),
        ...(courseData.courseLevel !== undefined && {
          courseLevel: courseData.courseLevel,
        }),
      };

      const newCourse = await this.courseService.createCourse(payload);

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: newCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (
    req: Request<UpdateCourseInput["params"], {}, UpdateCourseInput["body"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const updateData = req.body;

      const updatePayload = {
        ...(updateData.title !== undefined && { title: updateData.title }),
        ...(updateData.description !== undefined && {
          description: updateData.description,
        }),
        ...(updateData.price !== undefined && { price: updateData.price }),
        ...(updateData.category !== undefined && {
          category: updateData.category,
        }),
        ...(updateData.courseLevel !== undefined && {
          courseLevel: updateData.courseLevel,
        }),
      };

      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        updatePayload
      );

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public publishCourse = async (
    req: Request<PublishCourseInput["params"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const publishedCourse = await this.courseService.publishCourse(courseId);

      res.status(200).json({
        success: true,
        message: "Course published successfully",
        data: publishedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (
    req: Request<GetCourseByIdInput["params"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;

      const course = await this.courseService.getCourseById(courseId);

      if (!course) {
        res.status(404).json({
          success: false,
          message: "Course not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Course retrieved successfully",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCourses = async (
    req: Request<{}, {}, {}, GetCoursesInput["query"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        courseLevel,
        status,
        sortBy,
        sortOrder,
        enrollmentStatus,
      } = req.query;
      const userId = (req as any).user?.userId;
      const params: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        courseLevel?: any;
        status?: any;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        userId?: string;
        enrollmentStatus?: string;
      } = {};

      if (page) params.page = parseInt(page, 10);
      if (limit) params.limit = parseInt(limit, 10);
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      if (courseLevel) params.courseLevel = courseLevel;
      if (status) params.status = status;
      else params.status = "PUBLISHED";
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder as "asc" | "desc";
      if (userId) params.userId = userId;
      if (enrollmentStatus) params.enrollmentStatus = enrollmentStatus;

      const { courses, total } = await this.courseService.getCourses(params);

      // Luôn trả về pagination nếu có page và limit, nếu không thì vẫn trả về pagination với giá trị mặc định
      if (params.page && params.limit) {
        const totalPages = Math.ceil(total / params.limit);
        res.status(200).json({
          success: true,
          message: "Courses retrieved successfully",
          data: {
            data: courses,
            pagination: {
              page: params.page,
              limit: params.limit,
              total,
              totalPages,
            },
          },
        });
      } else {
        // Không có pagination - trả về tất cả nhưng vẫn có pagination object để frontend không lỗi
        res.status(200).json({
          success: true,
          message: "Courses retrieved successfully",
          data: {
            data: courses,
            pagination: {
              page: 1,
              limit: total,
              total,
              totalPages: 1,
            },
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getCoursesBySeller = async (
    req: Request<
      GetCoursesBySellerInput["params"],
      {},
      {},
      GetCoursesBySellerInput["query"]
    >,
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
        message: "Courses retrieved successfully",
        data: {
          data: filteredCourses,
          count: filteredCourses.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyCourses = async (
    req: Request<{}, {}, {}, GetCoursesBySellerInput["query"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { status } = req.query;

      const courses = await this.courseService.getCoursesBySeller(userId);

      const filteredCourses = status
        ? courses.filter((c) => c.status === status)
        : courses;

      res.status(200).json({
        success: true,
        message: "Courses retrieved successfully",
        data: {
          data: filteredCourses,
          count: filteredCourses.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
