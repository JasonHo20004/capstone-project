// =============================================================================
// Coupon Controller — HTTP layer
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "@capstone/common";
import { CouponService } from "../services/coupon.service.js";
import { databaseService } from "../../../services/database.service.js";

export class CouponController {
  private couponService = new CouponService();
  private prisma = databaseService.getClient();

  list = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt((req.query.limit as string) ?? "20", 10) || 20)
    );
    const search = (req.query.search as string) || undefined;
    const status = (req.query.status as "active" | "inactive" | "expired" | "all") || "all";
    const result = await this.couponService.list({ page, limit, search, status });
    res.json({ success: true, ...result });
  });

  getOne = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await this.couponService.getById(id);
    res.json({ success: true, data: coupon });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!.userId;
    const coupon = await this.couponService.create({ ...req.body, createdById: adminId });
    res.status(201).json({ success: true, data: coupon });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await this.couponService.update(id, req.body);
    res.json({ success: true, data: coupon });
  });

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await this.couponService.deactivate(id);
    res.json({ success: true, data: coupon });
  });

  /**
   * Validate a code against the learner's current cart subtotal. Subtotal is
   * recomputed server-side from CartItem.priceAtTime, never trusted from the
   * client payload.
   */
  validate = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const code = (req.body?.code as string) || "";

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Giỏ hàng trống");
    }
    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.priceAtTime),
      0
    );

    const result = await this.couponService.validateForUser({ code, userId, subtotal });
    res.json({ success: true, data: result });
  });
}
