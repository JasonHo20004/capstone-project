import type { Request, Response } from "express";
import { ApplicationManagementService } from "@/modules/application-management-by-admin/services/application-management.service";

export class ApplicationManagementController {
  private service = new ApplicationManagementService();

  public getAllApplications = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const applications = await this.service.getAllApplications();
      res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn đăng ký thành công",
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách đơn đăng ký",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public getApplicationById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
        });
        return;
      }

      const application = await this.service.getApplicationById(id);
      res.status(200).json({
        success: true,
        message: "Lấy chi tiết đơn đăng ký thành công",
        data: application,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đăng ký",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public updateApplicationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
        });
        return;
      }

      if (!status || !["APPROVED", "REJECTED"].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Status phải là 'Duyệt' hoặc 'Từ chối'",
        });
        return;
      }

      const updatedApplication = await this.service.updateApplicationStatus(
        id,
        status
      );

      res.status(200).json({
        success: true,
        message: `${
          status === "APPROVED" ? "Duyệt" : "Từ chối"
        } đơn đăng ký thành công`,
        data: updatedApplication,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái đơn đăng ký",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
