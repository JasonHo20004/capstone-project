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
        if (error.message === "Bạn chưa đăng ký khóa học này") {
          res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập vào khóa học này",
          });
          return;
        }
        if (
          error.message === "Bài học không tồn tại" ||
          error.message === "Bài học không thuộc khóa học này"
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
        if (error.message === "Khóa học không tồn tại hoặc không có bài học") {
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
        if (error.message === "Bạn chưa đăng ký khóa học này") {
          res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập vào khóa học này",
          });
          return;
        }
        if (error.message === "Khóa học không tồn tại") {
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

      const result = await this.studentService.getLessonComments(
        userId,
        courseId,
        lessonId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Lấy bình luận bài học thành công",
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
        if (error.message === "Bạn chưa đăng ký khóa học này") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Bài học không thuộc khóa học này") {
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

      const comment = await this.studentService.createLessonComment(
        userId,
        courseId,
        lessonId,
        content,
        parentCommentId
      );

      res.status(201).json({
        success: true,
        message: "Tạo bình luận bài học thành công",
        data: comment,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Bạn chưa đăng ký khóa học này") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Bài học không thuộc khóa học này") {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Nội dung bình luận là bắt buộc") {
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
          message: "ID khóa học là bắt buộc",
        });
        return;
      }

      const result = await this.studentService.getCourseRatings(courseId, page, limit);

      res.status(200).json({
        success: true,
        message: "Lấy đánh giá khóa học thành công",
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

      const rating = await this.studentService.createCourseRating(
        userId,
        courseId,
        score,
        content
      );

      res.status(201).json({
        success: true,
        message: "Tạo đánh giá khóa học thành công",
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Bạn cần mua khóa học này để đánh giá") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Bạn đã đánh giá khóa học này rồi") {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Điểm đánh giá phải từ 1 đến 5") {
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
          message: "Chưa xác thực",
        });
        return;
      }

      const result = await this.studentService.getUserEnrolledCourses(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "Lấy khóa học đã đăng ký thành công",
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
        if (error.message === "Bạn chưa đăng ký khóa học này") {
          res.status(403).json({
            success: false,
            message: error.message,
          });
          return;
        }
        if (error.message === "Bài học không thuộc khóa học này") {
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