import type { Request, Response, NextFunction } from "express";
import { CourseService } from "@/modules/courses/services/course.service";
import { NotificationService } from "@/modules/notifications/services/notification.service";
import type {
  CreateCourseInput,
  UpdateCourseInput,
  PublishCourseInput,
  GetCourseByIdInput,
  GetCoursesBySellerInput,
  GetCoursesInput,
} from "../dtos/course.dto";
import { UserRole } from "@/../generated/prisma";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class CourseController {
  private courseService = new CourseService();
  private notificationService = new NotificationService();

  public createCourse = async (
    req: Request<{}, CreateCourseInput["body"], CreateCourseInput["body"]>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseData = req.body;
      const courseSellerId = (req as any).user?.userId;
      const file = (req as any).file;
      

      if (!courseSellerId) {
        res.status(401).json({
          success: false,
          message: "Chưa có quyền truy cập",
        });
        return;
      }

      // Get thumbnail URL from uploaded file or from body
      let thumbnailUrl: string | undefined = courseData.thumbnailUrl;
      if (file) {
        // File uploaded to S3, get the URL
        thumbnailUrl = file.location || file.key;
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
        ...(thumbnailUrl !== undefined && {
          thumbnailUrl: thumbnailUrl,
        }),
      };

      const newCourse = await this.courseService.createCourse(payload);

      res.status(201).json({
        success: true,
        message: "Khoá học đã được tạo thành công",
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
      const file = (req as any).file;

      // Get thumbnail URL from uploaded file or from body
      let thumbnailUrl: string | undefined = updateData.thumbnailUrl;
      if (file) {
        // File uploaded to S3, get the URL
        thumbnailUrl = file.location || file.key;
      }

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
        ...(thumbnailUrl !== undefined && {
          thumbnailUrl: thumbnailUrl,
        }),
      };

      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        updatePayload
      );

      try {
        const title = "Cập nhật khoá học";
        const content = `Khoá học "${updatedCourse.title}" đã được cập nhật. Vui lòng kiểm tra lại nội dung và thông tin khoá học.`;
        await this.notificationService.sendCourseUpdateNotifications(
          courseId,
          title,
          content
        );
      } catch (err) {
        // Do not block course update if notification delivery fails or no students enrolled
        console.warn(
          "Cập nhật thông báo khoá học thất bại hoặc bị bỏ qua:",
          err instanceof Error ? err.message : String(err)
        );
      }

      res.status(200).json({
        success: true,
        message: "Khoá học đã được cập nhật thành công",
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
        message: "Khoá học đã được công khai thành công",
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
          message: "Khoá học không tồn tại",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Khoá học đã được lấy thành công",
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
      const authenticatedReq = req as AuthenticatedRequest;
      const userId = authenticatedReq.user?.userId;
      const userRole = authenticatedReq.user?.role;
      const isAdmin = userRole === UserRole.ADMINISTRATOR;
      
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
      if (status) {
        params.status = status;
      } else {
        // Chỉ set mặc định PUBLISHED nếu không phải admin
        // Admin có thể xem tất cả courses với mọi trạng thái
        if (!isAdmin) {
          params.status = "PUBLISHED";
        }
      }
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
          message: "Khoá học đã được lấy thành công",
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
          message: "Khoá học đã được lấy thành công",
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
        message: "Khoá học đã được lấy thành công",
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
          message: "Chưa có quyền truy cập",
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
        message: "Khoá học đã được lấy thành công",
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
