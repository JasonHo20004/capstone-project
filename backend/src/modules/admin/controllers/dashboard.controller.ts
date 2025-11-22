import type { Request, Response } from 'express';
import { DashboardService } from '@/modules/admin/services/dashboard.service';

export class DashboardController {
  private service = new DashboardService();

  // Get dashboard stats only
  public getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.service.getDashboardStats();
      res.status(200).json({
        success: true,
        message: 'Lấy thống kê dashboard thành công',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê dashboard',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get complete dashboard data
  public getDashboardData = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getDashboardData();
      res.status(200).json({
        success: true,
        message: 'Lấy dữ liệu dashboard thành công',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu dashboard',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get revenue data
  public getRevenueData = async (req: Request, res: Response): Promise<void> => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const data = await this.service.getRevenueData(months);
      res.status(200).json({
        success: true,
        message: 'Lấy dữ liệu doanh thu thành công',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu doanh thu',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get user growth data
  public getUserGrowthData = async (req: Request, res: Response): Promise<void> => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const data = await this.service.getUserGrowthData(months);
      res.status(200).json({
        success: true,
        message: 'Lấy dữ liệu tăng trưởng người dùng thành công',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu tăng trưởng người dùng',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get course status data
  public getCourseStatusData = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getCourseStatusData();
      res.status(200).json({
        success: true,
        message: 'Lấy dữ liệu trạng thái khóa học thành công',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu trạng thái khóa học',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
