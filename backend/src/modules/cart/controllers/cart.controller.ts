import type { Response } from "express";
import { CartService } from "@/modules/cart/services/cart.service";
import type {
  AddToCartInput
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
        message: "Add this course to cart  successfully",
        data: cartItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add this course to cart ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
 public checkout = async (
    req: AuthenticatedRequest ,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      
      const order = await this.cartService.checkout(userId);

      res.status(200).json({
        success: true,
        message: "Checkout this cart successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to checkout this cart ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  
}
