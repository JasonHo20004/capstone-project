import type { Request, Response } from "express";
import { asyncHandler } from "@capstone/common";
import { TopupService } from "../services/topup.service.js";

export class TopupController {
  private topupService = new TopupService();

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { realMoney } = req.body;

    const result = await this.topupService.createOrder(userId, Number(realMoney));

    res.status(201).json({
      success: true,
      data: result,
      message: "Stripe checkout URL created",
    });
  });

  getOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

    const result = await this.topupService.getOrderStatus(orderId, userId);

    res.json({ success: true, data: result });
  });

  // Stripe success redirect — browser arrives here with ?session_id=cs_test_...
  handleStripeReturn = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.query.session_id ?? "");
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (!sessionId) {
      return res.redirect(`${frontendUrl}/payment/result?status=failed`);
    }

    const result = await this.topupService.confirmStripeSession(sessionId);
    const status = result.success ? "success" : "failed";
    const orderId = result.orderId ?? "";
    const amount = result.amount ? String(result.amount) : "";

    res.redirect(
      `${frontendUrl}/payment/result?status=${status}&orderId=${orderId}&txnRef=${encodeURIComponent(sessionId)}&amount=${amount}`
    );
  });

  // Stripe cancel redirect — user clicked back on Stripe Checkout.
  handleStripeCancel = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = String(req.query.session_id ?? "");
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (sessionId) {
      await this.topupService.cancelStripeSession(sessionId);
    }

    res.redirect(
      `${frontendUrl}/payment/result?status=failed&txnRef=${encodeURIComponent(sessionId)}`
    );
  });
}
