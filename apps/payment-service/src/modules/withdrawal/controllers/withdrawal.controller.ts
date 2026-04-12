// =============================================================================
// Withdrawal Controller - HTTP handlers for payout endpoints
// =============================================================================

import { Request, Response } from "express";
import { WithdrawalService } from "../services/withdrawal.service.js";
import { asyncHandler } from "@capstone/common";
import { WithdrawalRequestStatus } from "../../../../generated/prisma/index.js";

export class WithdrawalController {
  private withdrawalService = new WithdrawalService();

  // ── [SELLER] Endpoints ──────────────────────────────────────────────────

  requestWithdrawal = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const { amount, bankName, accountName, accountNumber } = req.body;

    if (!amount || !bankName || !accountName || !accountNumber) {
      res.status(400).json({ success: false, message: "Missing required withdrawal details" });
      return;
    }

    try {
      const request = await this.withdrawalService.requestWithdrawal(sellerId, parseFloat(amount), {
        bankName,
        accountName,
        accountNumber,
      });

      res.status(201).json({ success: true, data: request, message: "Withdrawal request submitted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit withdrawal request";
      res.status(400).json({ success: false, message });
    }
  });

  getSellerWithdrawals = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await this.withdrawalService.getSellerWithdrawals(sellerId, page, limit);
    res.json({ success: true, ...result });
  });

  // ── [ADMIN] Endpoints ───────────────────────────────────────────────────

  getAdminRequests = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as WithdrawalRequestStatus | undefined;

    const result = await this.withdrawalService.getAdminWithdrawalRequests(page, limit, status);
    res.json({ success: true, ...result });
  });

  getAdminSummary = asyncHandler(async (_req: Request, res: Response) => {
    const summary = await this.withdrawalService.getAdminWithdrawalSummary();
    res.json({ success: true, data: summary });
  });

  approveWithdrawal = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { proofImageUrl, adminNote } = req.body;

    try {
      const result = await this.withdrawalService.approveWithdrawal(id, proofImageUrl, adminNote);
      res.json({ success: true, data: result, message: "Withdrawal approved successfully" });
    } catch (error) {
       const message = error instanceof Error ? error.message : "Failed to approve request";
       res.status(400).json({ success: false, message });
    }
  });

  rejectWithdrawal = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { adminNote } = req.body;

    if (!adminNote) {
      res.status(400).json({ success: false, message: "Rejection reason (adminNote) is required" });
      return;
    }

    try {
      const result = await this.withdrawalService.rejectWithdrawal(id, adminNote);
      res.json({ success: true, data: result, message: "Withdrawal rejected and funds refunded" });
    } catch (error) {
       const message = error instanceof Error ? error.message : "Failed to reject request";
       res.status(400).json({ success: false, message });
    }
  });
}
