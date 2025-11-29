import type { Response } from "express";
import { TopupOrderService } from "@/modules/topupOrders/services/topupOrder.service";
import type {
  CreateTopupInput,
} from "@/modules/topupOrders/dtos/topupOrder.dto";

import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class TopupOrderController {
  private topupOrderService = new TopupOrderService();

  public createOrder = async (
    req: AuthenticatedRequest & { body: CreateTopupInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { realMoney } = req.body;
      const { order, payUrl } = await this.topupOrderService.createTopupOrder(
        userId,
        realMoney
      );
      res.status(200).json({
        success: true,
        message: "Create topup order successfully",
        data: { orderId: order.id, payUrl },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Create topup order",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public confirmPayment = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      // Lấy toàn bộ query params hoặc body (tùy method GET hay POST mà MoMo redirect về)
      // Thông thường redirect là GET, còn IPN là POST.
      // Ở đây ta giả sử Client gọi endpoint này và truyền data lên body
      const paymentData = req.body;

      const updatedWallet = await this.topupOrderService.confirmPayment(
        paymentData
      );

      res.status(200).json({
        success: true,
        message: "Topup successfully!",
        data: updatedWallet,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Topup",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
