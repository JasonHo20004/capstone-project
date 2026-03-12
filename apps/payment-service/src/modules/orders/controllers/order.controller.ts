// =============================================================================
// Order Controller - HTTP handlers for order endpoints
// =============================================================================

import { Request, Response } from "express";
import { OrderService } from "../services/order.service.js";
import { asyncHandler } from "@capstone/common";

export class OrderController {
  private orderService = new OrderService();

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { cartId } = req.body;
    const order = await this.orderService.createOrder(userId, cartId);
    res.status(201).json({ success: true, data: order });
  });

  payOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await this.orderService.payOrder(userId, id);
    res.json({ success: true, data: result, message: "Payment successful" });
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.orderService.getOrderHistory(userId, page, limit);
    res.json({ success: true, ...result });
  });
}
