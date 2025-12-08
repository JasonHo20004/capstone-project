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
          message: 'Xuất báo cáo hoàn thành thành công',
          data: exportResult,
        });
        return;
      }

      const analytics = await this.analyticsService.getCompletionRate(courseId);

      if (analytics.totalEnrolled === 0) {
        res.status(200).json({
          success: true,
          message: 'Không có dữ liệu để tính toán tỉ lệ hoàn thành',
          data: analytics,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Tỉ lệ hoàn thành khóa học được tính toán thành công',
        data: analytics,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Course not found') {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy khóa học',
        });
        return;
      }
      next(error);
    }
  };
}

