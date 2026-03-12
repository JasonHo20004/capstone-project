// =============================================================================
// Wallet Controller - HTTP handlers for wallet endpoints
// =============================================================================

import { Request, Response } from "express";
import { WalletService } from "../services/wallet.service.js";
import { asyncHandler } from "@capstone/common";

export class WalletController {
  private walletService = new WalletService();

  getWallet = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const wallet = await this.walletService.getWallet(userId);
    res.json({ success: true, data: wallet });
  });

  deposit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { amount, description } = req.body;
    const wallet = await this.walletService.deposit(userId, amount, description);
    res.json({ success: true, data: wallet, message: "Deposit successful" });
  });

  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.walletService.getTransactionHistory(userId, page, limit);
    res.json({ success: true, ...result });
  });

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const summary = await this.walletService.getMonthlySummary(userId);
    res.json({ success: true, data: summary });
  });
}
