import type { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '@/modules/courses/services/analytics.service';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  public getCompletionRate = async (
    req: Request<{ courseId: string }, {}, {}, { export?: 'csv' | 'pdf' }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { export: exportFormat } = req.query;

      if (exportFormat && (exportFormat === 'csv' || exportFormat === 'pdf')) {
        const exportResult = await this.analyticsService.exportCompletionReport(
          courseId,
          exportFormat
        );
        res.status(200).json({
          success: true,
          message: 'Export generated successfully',
          data: exportResult,
        });
        return;
      }

      const analytics = await this.analyticsService.getCompletionRate(courseId);

      if (analytics.totalEnrolled === 0) {
        res.status(200).json({
          success: true,
          message: 'No data to calculate completion rate',
          data: analytics,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Completion rate retrieved successfully',
        data: analytics,
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
}

