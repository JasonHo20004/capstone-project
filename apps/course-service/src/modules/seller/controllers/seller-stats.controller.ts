import type { Request, Response } from "express";
import { SellerStatsService } from "../services/seller-stats.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string | null;
  };
}

export class SellerStatsController {
  private service = new SellerStatsService();

  /**
   * Get seller dashboard statistics
   * GET /api/seller/dashboard
   */
  getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const stats = await this.service.getDashboardStats(sellerId);
      res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get dashboard stats",
      });
    }
  };

  /**
   * Get seller's learners
   * GET /api/seller/learners
   */
  getLearners = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string | undefined;

      const result = await this.service.getLearners(sellerId, page, limit, search);
      res.status(200).json({
        success: true,
        data: result.learners,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get learners",
      });
    }
  };

  /**
   * Get seller's comments
   * GET /api/seller/comments
   */
  getComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string | undefined;

      const result = await this.service.getComments(sellerId, page, limit, search);
      res.status(200).json({
        success: true,
        data: result.comments,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get comments",
      });
    }
  };

  /**
   * Get seller's courses with stats
   * GET /api/seller/courses
   */
  getMyCourses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.service.getMyCourses(sellerId, page, limit);
      res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get courses",
      });
    }
  };
}
