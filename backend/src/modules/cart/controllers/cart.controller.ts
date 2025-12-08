import type { Response } from "express";
import { CartService } from "@/modules/cart/services/cart.service";
import type {
  AddToCartInput,
  DirectBuyInput,
  PartialCheckoutInput
} from "@/modules/cart/dtos/cart.dto";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class CartController {
  private cartService = new CartService();

  public addToCart = async (
    req: AuthenticatedRequest & { body: AddToCartInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { courseId} =req.body;
      const cartItem = await this.cartService.addCourseToCart(userId, {
        courseId
      });

      res.status(200).json({
        success: true,
        message: "Thêm khóa học vào giỏ hàng thành công",
        data: cartItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi thêm khóa học vào giỏ hàng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
 public checkoutCart = async (
    req: AuthenticatedRequest ,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      
      const order = await this.cartService.checkoutCart(userId);

      res.status(200).json({
        success: true,
        message: "Checkout giỏ hàng thành công",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi checkout giỏ hàng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public checkoutDirectBuy = async (
    req: AuthenticatedRequest &{body:PartialCheckoutInput['body']} ,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const {courseId} = req.body
      const order = await this.cartService.directBuyCourse(userId,courseId);

      res.status(200).json({
        success: true,
        message: "Mua khóa học thành công",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi mua khóa học",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  
   public checkoutPartial = async (
    req: AuthenticatedRequest &{body:DirectBuyInput['body']} ,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const {cartItemIds} = req.body
      const order = await this.cartService.checkoutPartial(userId,cartItemIds);

      res.status(200).json({
        success: true,
        message: "Thanh toán giỏ hàng thành công",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi thanh toán giỏ hàng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

    public getUserCarts = async (
    req: AuthenticatedRequest  ,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
  
      const order = await this.cartService.getUserCart(userId);

      res.status(200).json({
        success: true,
        message: "Lấy giỏ hàng thành công",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy giỏ hàng",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
