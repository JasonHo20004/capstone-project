import type { Request, Response } from "express";
import type { JwtPayload } from "@capstone/common";
import { paymentClient } from "../../../clients/payment.client.js";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export class WithdrawalController {
  requestWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sellerId = req.user?.userId;
      if (!sellerId) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const { amount } = req.body;
      if (typeof amount !== "number" || amount <= 0) {
        res.status(400).json({ success: false, error: "amount must be a positive number" });
        return;
      }

      const result = await paymentClient.requestWithdrawal(sellerId, amount);
      res.status(202).json({
        success: true,
        message: "Withdrawal request submitted",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Withdrawal request failed",
      });
    }
  };
}
