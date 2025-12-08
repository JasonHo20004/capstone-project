import type { Request, Response } from "express";
import { CourseManagementService } from "@/modules/course-management-by-admin/services/course-management.service";

export class CourseManagementController {
  private service = new CourseManagementService();

  public getAllCourses = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const courses = await this.service.getAllCourses();
      res.status(200).json({
        success: true,
        message: "Lấy tất cả khóa học thành công",
        data: courses,
        count: courses.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy tất cả khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID khóa học là bắt buộc",
        });
        return;
      }
      const course = await this.service.getCourseById(id);
      res.status(200).json({
        success: true,
        message: "Lấy chi tiết khóa học thành công",
        data: course,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Khóa học không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy chi tiết khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getCourseLessons = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID khóa học là bắt buộc",
        });
        return;
      }
      const data = await this.service.getCourseLessons(id);
      res.status(200).json({
        success: true,
        message: "Lấy tất cả bài giảng của khóa học thành công",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Khóa học không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy tất cả bài giảng của khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getSpecificLesson = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "ID khóa học và ID bài giảng là bắt buộc",
        });
        return;
      }
      const data = await this.service.getSpecificLesson(courseId, lessonId);
      res.status(200).json({
        success: true,
        message: "Lấy bài giảng thành công",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Khóa học không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Bài giảng không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Bài giảng không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy bài giảng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;
      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "ID khóa học và ID bài giảng là bắt buộc",
        });
        return;
      }

      const data = await this.service.updateLesson(
        courseId,
        lessonId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật bài giảng thành công",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Lesson not found") {
        res.status(404).json({
          success: false,
          message: "Bài giảng không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật bài giảng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public deleteLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "ID khóa học và ID bài giảng là bắt buộc",
        });
        return;
      }
      await this.service.deleteLesson(courseId, lessonId);
      res.status(200).json({
        success: true,
        message: "Xóa bài giảng thành công",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Lesson not found") {
        res.status(404).json({
          success: false,
          message: "Bài giảng không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa bài giảng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, lessonId, commentId } = req.params;
      if (!courseId || !lessonId || !commentId) {
        res.status(400).json({
          success: false,
          message: "ID khóa học, ID bài giảng, và ID bình luận là bắt buộc",
        });
        return;
      }
      await this.service.deleteComment(courseId, lessonId, commentId);
      res.status(200).json({
        success: true,
        message: "Xóa bình luận thành công",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Lesson not found") {
        res.status(404).json({
          success: false,
          message: "Bài giảng không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Comment not found") {
        res.status(404).json({
          success: false,
          message: "Bình luận không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa bình luận",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getCourseRatings = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID khóa học là bắt buộc",
        });
        return;
      }
      const data = await this.service.getCourseRatings(id);
      res.status(200).json({
        success: true,
        message: "Lấy đánh giá khóa học thành công",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy đánh giá khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID khóa học là bắt buộc",
        });
        return;
      }
      const course = await this.service.updateCourse(id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật khóa học thành công",
        data: course,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Khóa học không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID khóa học là bắt buộc",
        });
        return;
      }
      await this.service.deleteCourse(id);
      res.status(200).json({
        success: true,
        message: "Xóa khóa học thành công",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Khóa học không tồn tại") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public uploadLessonVideo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { courseId, lessonId } = req.params;

      if (!courseId || !lessonId) {
        res.status(400).json({
          success: false,
          message: "ID khóa học và ID bài giảng là bắt buộc",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "File video là bắt buộc",
        });
        return;
      }

      // Get the S3 URL from multer-s3
      const videoUrl = (req.file as any).location;

      const data = await this.service.uploadLessonVideo(
        courseId,
        lessonId,
        videoUrl
      );

      res.status(200).json({
        success: true,
        message: "Upload video bài giảng thành công",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        res.status(404).json({
          success: false,
          message: "Khóa học không tồn tại",
        });
        return;
      }
      if (error instanceof Error && error.message === "Lesson not found") {
        res.status(404).json({
          success: false,
          message: "Bài giảng không tồn tại",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi upload video bài giảng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}