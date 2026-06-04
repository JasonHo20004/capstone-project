// =============================================================================
// Refund Controller - HTTP handlers
// =============================================================================

import { Request, Response } from "express";
import { RefundService } from "../services/refund.service.js";
import type { RefundRequestStatus } from "../../../../generated/prisma/index.js";

export class RefundController {
  private service = new RefundService();

  // ── Learner ─────────────────────────────────────────────────────────────
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const { orderId, reason } = req.body as { orderId?: string; reason?: string };
      if (!orderId || typeof orderId !== "string") {
        res.status(400).json({ success: false, error: "orderId là bắt buộc" });
        return;
      }
      if (!reason || reason.trim().length < 10) {
        res.status(400).json({ success: false, error: "Lý do phải có ít nhất 10 ký tự" });
        return;
      }
      const created = await this.service.createRequest({
        orderId,
        requesterId,
        reason: reason.trim(),
      });
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Tạo yêu cầu hoàn tiền thất bại",
      });
    }
  };

  listMine = async (req: Request, res: Response): Promise<void> => {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const result = await this.service.listByRequester(requesterId, page, limit);
      res.json({
        success: true,
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Lấy danh sách thất bại",
      });
    }
  };

  // ── Admin ───────────────────────────────────────────────────────────────
  listAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const statusParam = (req.query.status as string | undefined) ?? undefined;
      const validStatuses: RefundRequestStatus[] = [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
      ];
      const status =
        statusParam && validStatuses.includes(statusParam as RefundRequestStatus)
          ? (statusParam as RefundRequestStatus)
          : undefined;
      const result = await this.service.listAdmin({ page, limit, status });
      res.json({
        success: true,
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Lấy danh sách thất bại",
      });
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const { id } = req.params;
      const adminNote = (req.body?.adminNote as string | undefined)?.trim();
      const result = await this.service.approve(id as string, adminId, adminNote);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Duyệt hoàn tiền thất bại",
      });
    }
  };

  reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }
      const { id } = req.params;
      const adminNote = (req.body?.adminNote as string | undefined) ?? "";
      const result = await this.service.reject(id as string, adminId, adminNote);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Từ chối hoàn tiền thất bại",
      });
    }
  };
}
