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
        message: 'Get dashboard stats successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard stats',
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
        message: 'Get dashboard data successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data',
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
        message: 'Get revenue data successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get revenue data',
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
        message: 'Get user growth data successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user growth data',
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
        message: 'Get course status data successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get course status data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
