import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { StudentService } from "@/modules/student-learning/services/student.service";

export class StudentController {
  private studentService = new StudentService();

  /**
   * Get lesson details for the lesson player (enrolled students only)
   */
  public getLessonForPlayer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Chưa xác thực",
        });
        return;
      }

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "Course ID và Lesson ID là bắt buộc",
        });
        return;
      }

      const lesson = await this.studentService.getLessonForPlayer(
        userId,
        courseId,
        lessonId
      );

      res.status(200).json({
        success: true,
        message: "Lấy chi tiết bài học thành công",
        data: lesson,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Not enrolled in this course") {
          res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập vào khóa học này",
          });
          return;
        }
        if (
          error.message === "Lesson not found" ||
          error.message === "Lesson does not belong to this course"
        ) {
          res.status(404).json({
            success: false,
            message: "Bài học không tồn tại hoặc không thuộc khóa học này",
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Get course syllabus (structured tree of lessons)
   */
  public getCourseSyllabus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Chưa xác thực",
        });
        return;
      }

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: "Course ID là bắt buộc",
        });
        return;
      }

      const syllabus = await this.studentService.getCourseSyllabus(userId, courseId);

      res.status(200).json({
        success: true,
        message: "Lấy khung chương trình thành công",
        data: syllabus,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Course not found or has no lessons") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Get comprehensive course context (overview, progress, syllabus)
   */
  public getCourseContext = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Chưa xác thực",
        });
        return;
      }

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: "Course ID là bắt buộc",
        });
        return;
      }

      const context = await this.studentService.getCourseContext(userId, courseId);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin khóa học thành công",
        data: context,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Not enrolled in this course") {
          res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập vào khóa học này",
          });
          return;
        }
        if (error.message === "Course not found") {
          res.status(404).json({
            success: false,
            message: "Khóa học không tồn tại",
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Get lesson comments with pagination
   */
  public getLessonComments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "Bad Request: Course ID and Lesson ID are required",
        });
        return;
      }

      const result = await this.studentService.getLessonComments(
        userId,
        courseId,
        lessonId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Comments retrieved successfully",
        data: result.comments,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Not enrolled in this course") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Lesson does not belong to this course") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Create a comment on a lesson
   */
  public createLessonComment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      const { content, parentCommentId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "Bad Request: Course ID and Lesson ID are required",
        });
        return;
      }

      const comment = await this.studentService.createLessonComment(
        userId,
        courseId,
        lessonId,
        content,
        parentCommentId
      );

      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Not enrolled in this course") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Lesson does not belong to this course") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Comment content is required") {
          res.status(400).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * GET /api/student/courses/:courseId/ratings
   * Get course ratings (publicly accessible but through student routes)
   */
  public getCourseRatings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: "Bad Request: Course ID is required",
        });
        return;
      }

      const result = await this.studentService.getCourseRatings(courseId, page, limit);

      res.status(200).json({
        success: true,
        message: "Ratings retrieved successfully",
        data: result.ratings,
        averageScore: result.averageScore,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a rating for a course (verified purchasers only)
   */
  public createCourseRating = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { score, content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      if (!courseId) {
        res.status(400).json({
          success: false,
          message: "Bad Request: Course ID is required",
        });
        return;
      }

      const rating = await this.studentService.createCourseRating(
        userId,
        courseId,
        score,
        content
      );

      res.status(201).json({
        success: true,
        message: "Rating created successfully",
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "You must purchase this course to rate it") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "You have already rated this course") {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Rating score must be between 1 and 5") {
          res.status(400).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * Get user's enrolled courses
   */
  public getMyEnrolledCourses = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      const result = await this.studentService.getUserEnrolledCourses(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: result.courses,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark a lesson as completed
   */
  public markLessonComplete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "Bad Request: Course ID and Lesson ID are required",
        });
        return;
      }

      const result = await this.studentService.markLessonAsCompleted(
        userId,
        courseId,
        lessonId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Not enrolled in this course") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Lesson does not belong to this course") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };
}

