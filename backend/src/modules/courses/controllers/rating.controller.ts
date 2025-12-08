import type { Request, Response, NextFunction } from 'express';
import { RatingService } from '@/modules/courses/services/rating.service';

export class RatingController {
  private ratingService = new RatingService();

  public getCourseRatings = async (
    req: Request<{ courseId: string },{},{},{ starRating?: string; startDate?: string; endDate?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { starRating, startDate, endDate } = req.query;

      const filters: {
        starRating?: number;
        startDate?: Date;
        endDate?: Date;
      } = {};

      if (starRating) {
        const rating = parseInt(starRating, 10);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          res.status(400).json({
            success: false,
            message: 'Số sao phải nằm trong khoảng từ 1 đến 5',
          });
          return;
        }
        filters.starRating = rating;
      }

      if (startDate) {
        filters.startDate = new Date(startDate);
        if (isNaN(filters.startDate.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Ngày bắt đầu không hợp lệ',
          });
          return;
        }
      }

      if (endDate) {
        filters.endDate = new Date(endDate);
        if (isNaN(filters.endDate.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Ngày kết thúc không hợp lệ',
          });
          return;
        }
      }

      const ratings = await this.ratingService.getCourseRatings(courseId, filters);

      if (ratings.length === 0) {
        res.status(200).json({
          success: true,
          message: 'Chưa có đánh giá từ sinh viên nào',
          data: [],
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Danh sách đánh giá đã được lấy thành công',
        data: ratings,
        count: ratings.length,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Khoá học không tồn tại',
        });
        return;
      }
      next(error);
    }
  };

  public replyToRating = async (
    req: Request<{ ratingId: string }, {}, { replyContent: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ratingId } = req.params;
      const { replyContent } = req.body;

      if (!replyContent || replyContent.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Vui lòng nhập nội dung phản hồi',
        });
        return;
      }

      const rating = await this.ratingService.replyToRating(ratingId, replyContent);

      res.status(200).json({
        success: true,
        message: 'Phản hồi đã được thêm thành công',
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rating not found') {
          res.status(404).json({
            success: false,
            message: 'Đánh giá không tồn tại',
          });
          return;
        }
        if (error.message === 'Please enter your reply content') {
          res.status(400).json({
            success: false,
            message: 'Vui lòng nhập nội dung phản hồi',
          });
          return;
        }
      }
      next(error);
    }
  };

  public reportRating = async (
    req: Request<{ ratingId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ratingId } = req.params;

      const rating = await this.ratingService.reportRating(ratingId);

      res.status(200).json({
        success: true,
        message: 'Đánh giá đã được báo cáo thành công',
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rating not found') {
          res.status(404).json({
            success: false,
            message: 'Đánh giá không tồn tại',
          });
          return;
        }
        if (error.message === 'This rating has already been reported') {
          res.status(400).json({
            success: false,
            message: 'Đánh giá này đã được báo cáo',
          });
          return;
        }
      }
      next(error);
    }
  };
}

