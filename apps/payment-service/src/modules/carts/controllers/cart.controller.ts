// =============================================================================
// Cart Controller - HTTP handlers for cart endpoints
// =============================================================================

import { Request, Response } from "express";
import { CartService } from "../services/cart.service.js";
import { asyncHandler } from "@capstone/common";

export class CartController {
  private cartService = new CartService();

  getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const cart = await this.cartService.getCart(userId);
    res.json({ success: true, data: cart });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { courseId } = req.body;
    if (!courseId) {
      throw new Error("courseId is required");
    }
    const cart = await this.cartService.addToCart(userId, courseId);
    res.status(201).json({ success: true, data: cart, message: "Added to cart" });
  });

  checkoutFullCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.cartService.checkoutFullCart(userId);
    res.json({ success: true, data: result, message: "Checkout successful" });
  });

  checkoutPartial = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { cartItemIds } = req.body;
    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      throw new Error("cartItemIds array is required");
    }
    const result = await this.cartService.checkoutPartial(userId, cartItemIds);
    res.json({ success: true, data: result, message: "Checkout successful" });
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const rawId = req.params.cartItemId;
    const cartItemId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!cartItemId) {
      throw new Error("cartItemId is required");
    }
    const cart = await this.cartService.removeFromCart(userId, cartItemId);
    res.json({ success: true, data: cart, message: "Removed from cart" });
  });

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const cart = await this.cartService.clearCart(userId);
    res.json({ success: true, data: cart, message: "Cart cleared" });
  });

  directBuy = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { courseId } = req.body;
    if (!courseId) {
      throw new Error("courseId is required");
    }
    const result = await this.cartService.directBuy(userId, courseId);
    res.json({ success: true, data: result, message: "Purchase successful" });
  });
}
