// =============================================================================
// Commission Controller - HTTP handlers for commission endpoints
// =============================================================================

import { Request, Response } from "express";
import { CommissionService } from "../services/commission.service.js";
import { asyncHandler } from "@capstone/common";

export class CommissionController {
  private commissionService = new CommissionService();

  // ── Seller endpoints ────────────────────────────────────────────────────

  getSellerEarnings = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.commissionService.getSellerEarnings(sellerId, page, limit);
    res.json({ success: true, ...result });
  });

  getSellerCommissionRate = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const rate = await this.commissionService.getCommissionRate(sellerId);
    res.json({ success: true, data: { commissionRate: rate } });
  });

  // ── Admin endpoints ─────────────────────────────────────────────────────

  getAdminReport = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.commissionService.getAdminCommissionReport(page, limit);
    res.json({ success: true, ...result });
  });

  getConfig = asyncHandler(async (_req: Request, res: Response) => {
    const config = await this.commissionService.getConfig();
    res.json({ success: true, data: config });
  });

  updateGlobalRate = asyncHandler(async (req: Request, res: Response) => {
    const { rate } = req.body;
    if (rate === undefined || typeof rate !== "number") {
      res.status(400).json({ success: false, message: "Rate is required and must be a number" });
      return;
    }
    const result = await this.commissionService.updateGlobalRate(rate);
    res.json({ success: true, data: result, message: "Commission rate updated" });
  });

  updateConfig = asyncHandler(async (req: Request, res: Response) => {
    const { commissionRate, gatewayFeeRate, gatewayFeeFixed, clearanceDays } = req.body;
    const result = await this.commissionService.updateGlobalConfig({
      commissionRate,
      gatewayFeeRate,
      gatewayFeeFixed,
      clearanceDays,
    });
    res.json({ success: true, data: result, message: "Configuration updated" });
  });

  releaseEarnings = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.commissionService.releaseMaturedEarnings();
    res.json({ success: true, data: result, message: `Released ${result.released} earnings` });
  });
}
