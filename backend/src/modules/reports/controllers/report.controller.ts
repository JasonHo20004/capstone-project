import type {Request, Response } from "express";
import { ReportService } from "@/modules/reports/services/report.service";
import type { CreateReportCourseInput, GetDetailReportInput } from "@/modules/reports/dtos/report.dto";
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
        message: "Báo cáo khóa học thành công",
        data: newReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Báo cáo khóa học thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
 public getAllReports = async (
    _req:Request,
    res: Response
  ): Promise<void> => {
    try {
      
      const reports = await this.reportService.getAllReports();

      res.status(200).json({
        success: true,
        message: "Lấy tất cả báo cáo thành công",
        data: reports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy tất cả báo cáo thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
 public getDetailReport = async (
    req:Request<GetDetailReportInput['params']>,
    res: Response
  ): Promise<void> => {
    try {
      const {reportId} = req.params
      const reports = await this.reportService.getDetailReport(reportId);

      res.status(200).json({
        success: true,
        message: "Lấy chi tiết báo cáo thành công",
        data: reports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy chi tiết báo cáo thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
