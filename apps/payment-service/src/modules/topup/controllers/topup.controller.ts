// =============================================================================
// Topup Controller - HTTP handlers for topup endpoints
// =============================================================================

import { Request, Response } from "express";
import { TopupService } from "../services/topup.service.js";
import { asyncHandler } from "@capstone/common";

export class TopupController {
  private topupService = new TopupService();

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { realMoney, paymentMethod } = req.body;

    const result = await this.topupService.createOrder(
      userId,
      Number(realMoney),
      paymentMethod || "MOMO"
    );

    res.status(201).json({
      success: true,
      data: result,
      message: "Topup order created",
    });
  });

  confirmPayment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const params = { ...req.body, ...req.query } as Record<string, unknown>;

    const wallet = await this.topupService.confirmPayment(userId, params);

    res.json({
      success: true,
      data: wallet,
      message: "Payment confirmed successfully",
    });
  });
}
