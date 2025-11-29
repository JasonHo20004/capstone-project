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
            message: 'Invalid star rating. Must be between 1 and 5',
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
            message: 'Invalid start date format',
          });
          return;
        }
      }

      if (endDate) {
        filters.endDate = new Date(endDate);
        if (isNaN(filters.endDate.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Invalid end date format',
          });
          return;
        }
      }

      const ratings = await this.ratingService.getCourseRatings(courseId, filters);

      if (ratings.length === 0) {
        res.status(200).json({
          success: true,
          message: 'No reviews from students yet',
          data: [],
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ratings retrieved successfully',
        data: ratings,
        count: ratings.length,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Course not found',
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
          message: 'Please enter your reply content',
        });
        return;
      }

      const rating = await this.ratingService.replyToRating(ratingId, replyContent);

      res.status(200).json({
        success: true,
        message: 'Reply added successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rating not found') {
          res.status(404).json({
            success: false,
            message: 'Rating not found',
          });
          return;
        }
        if (error.message === 'Please enter your reply content') {
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
        message: 'Rating reported successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rating not found') {
          res.status(404).json({
            success: false,
            message: 'Rating not found',
          });
          return;
        }
        if (error.message === 'This rating has already been reported') {
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
}

