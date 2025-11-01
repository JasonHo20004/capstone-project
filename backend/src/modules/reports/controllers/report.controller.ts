import type { Response } from "express";
import { ReportService } from "@/modules/reports/services/report.service";
import type { CreateReportCourseInput } from "@/modules/reports/dtos/report.dto";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class ReportController {
  private reportService = new ReportService();

  public reportCourse = async (
    req: AuthenticatedRequest & {
      body: CreateReportCourseInput["body"];
      params: CreateReportCourseInput["params"];
    },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { courseId } = req.params;
      const { reasonType, content } = req.body;
      const newReport = await this.reportService.createReportCourse(userId, {
        courseId,
        reasonType,
        content,
      });

      res.status(200).json({
        success: true,
        message: "Report this course successfully",
        data: newReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to report this course",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
