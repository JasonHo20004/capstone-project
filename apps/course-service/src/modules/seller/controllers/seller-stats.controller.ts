import type { Request, Response } from "express";
import type { JwtPayload } from "@capstone/common";
import { SellerStatsService } from "../services/seller-stats.service.js";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
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
      const courseId = req.query.courseId as string | undefined;

      const result = await this.service.getLearners(sellerId, page, limit, search, courseId);
      res.status(200).json({
        success: true,
        data: {
          learners: result.learners,
          pagination: result.pagination,
        },
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
   * GET /api/seller/comments?search=&courseId=&status=unanswered|answered|all
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
      const courseId = req.query.courseId as string | undefined;
      const statusParam = (req.query.status as string | undefined)?.toLowerCase();
      const status =
        statusParam === "unanswered" || statusParam === "answered" ? statusParam : "all";

      const result = await this.service.getComments(sellerId, page, limit, search, {
        courseId,
        status,
      });
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
   * Inbox summary used by the comments dashboard header.
   * GET /api/seller/comments/summary
   */
  getCommentsSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const data = await this.service.getCommentsSummary(sellerId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get comments summary",
      });
    }
  };

  /**
   * Delete a comment on one of seller's own courses (moderation).
   * DELETE /api/seller/comments/:commentId
   */
  deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const commentId = req.params.commentId as string;
      await this.service.deleteComment(sellerId, commentId);
      res.status(200).json({ success: true, message: "Đã xoá bình luận" });
    } catch (error) {
      const statusCode = (error as any).statusCode ?? 500;
      const message = error instanceof Error ? error.message : "Không thể xoá bình luận";
      res.status(statusCode).json({ success: false, message });
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

  /**
   * Get seller's monthly earnings
   * GET /api/seller/fees?year=2025
   */
  getMonthlyFees = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const year = req.query.year ? parseInt(req.query.year as string) : undefined;

      const result = await this.service.getMonthlyFees(sellerId, year);
      res.status(200).json({
        success: true,
        data: {
          fees: result.fees,
          year: result.year,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get monthly fees",
      });
    }
  };

  /**
   * Drill-down detail for one (year, month) bucket of seller fees.
   * GET /api/seller/fees/:year/:month/detail
   */
  getMonthlyFeeDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const year = parseInt(req.params.year as string);
      const month = parseInt(req.params.month as string);
      if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
        res.status(400).json({ success: false, message: "Tham số year/month không hợp lệ" });
        return;
      }
      const rows = await this.service.getMonthlyFeeDetail(sellerId, year, month);
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get monthly fee detail",
      });
    }
  };
}
