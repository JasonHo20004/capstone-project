import type { Request, Response } from "express";
import { asyncHandler } from "@capstone/common";
import { TopupService } from "../services/topup.service.js";

export class TopupController {
  private topupService = new TopupService();

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { realMoney } = req.body;
    const ipAddr =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const result = await this.topupService.createOrder(userId, Number(realMoney), ipAddr);

    res.status(201).json({
      success: true,
      data: result,
      message: "VNPay payment URL created",
    });
  });

  getOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

    const result = await this.topupService.getOrderStatus(orderId, userId);

    res.json({ success: true, data: result });
  });

  // VNPay IPN — server-to-server callback, must respond quickly with RspCode
  handleIpn = asyncHandler(async (req: Request, res: Response) => {
    const params = req.query as Record<string, string>;
    const result = await this.topupService.handleIpn(params);
    res.json(result);
  });

  // VNPay return — browser redirect after payment, redirects user to frontend
  handleReturn = asyncHandler(async (req: Request, res: Response) => {
    const params = req.query as Record<string, string>;
    const result = await this.topupService.verifyReturn(params);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const status = result.success ? "success" : "failed";
    const orderId = "orderId" in result ? result.orderId : "";
    const txnRef = result.txnRef ?? "";

    res.redirect(
      `${frontendUrl}/payment/result?status=${status}&orderId=${orderId}&txnRef=${encodeURIComponent(txnRef)}`
    );
  });
}
