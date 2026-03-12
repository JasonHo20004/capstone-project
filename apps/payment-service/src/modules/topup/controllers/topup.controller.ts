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
      message: "Stripe payment intent created",
    });
  });

  getOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;

    const result = await this.topupService.getOrderStatus(orderId, userId);

    res.json({
      success: true,
      data: result,
    });
  });

  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const rawSignature = req.headers["stripe-signature"];
    const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature;
    const payload = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);

    const result = await this.topupService.handleWebhook(signature, payload);

    res.json(result);
  });
}
