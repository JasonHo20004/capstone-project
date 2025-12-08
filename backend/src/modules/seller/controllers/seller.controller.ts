import type { Response } from 'express';
import { SellerService } from '../services/seller.service';
import type { AuthenticatedRequest } from '@/middlewares/auth.middleware';

export class SellerController {
  private service = new SellerService();

  /**
   * Get seller dashboard statistics
   */
  public getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
        return;
      }

      const stats = await this.service.getDashboardStats(sellerId);
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

  /**
   * Get seller's learners
   */
  public getLearners = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string | undefined;

      const result = await this.service.getLearners(sellerId, page, limit, search);
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách người học thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách người học',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  /**
   * Get seller's comments
   */
  public getComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string | undefined;

      const result = await this.service.getComments(sellerId, page, limit, search);
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách bình luận thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách bình luận',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  /**
   * Get seller's monthly fees
   */
  public getMonthlyFees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await this.service.getMonthlyFees(sellerId, page, limit);
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách phí hằng tháng thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách phí hằng tháng',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}

