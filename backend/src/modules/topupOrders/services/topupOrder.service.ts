import { UserRepository } from "@/modules/users/repositories/user.repository";

import { databaseService } from "@/services/database.service";
import { WalletRepository } from "@/modules/users/repositories/wallet.repository";
import type { TopupOrder, Wallet } from "@prisma/client";
import { TopupOrderRepository } from "@/modules/topupOrders/repositories/topupOrder.repository";
import { TransactionRepository } from "@/modules/transactions/repositories/transaction.repository";

import {
  createMomoPayment,
  verifyMomoSignature,
} from "@/services/momo.service";
export class TopupOrderService {
  private topupOrderRepository = new TopupOrderRepository();
  private userRepository = new UserRepository();
  private walletRepository = new WalletRepository();
  private transactionRepository = new TransactionRepository();
  public async createTopupOrder(
    userId: string,
    realMoney: number
  ): Promise<{ order: TopupOrder; payUrl: string }> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("Người dùng không tồn tại");
    }

    // const existingPendingTopupOrder =
    //   await this.topupOrderRepository.findPendingTopupOrderById(userId);
    // if (existingPendingTopupOrder) {
    //   throw Error("Topup of this User is PENDING");
    // }
    const order = await this.topupOrderRepository.createOrder({
      userId: userId,
      realMoney: realMoney,
      realAmount: realMoney, // 1:1000
      paymentMethod: "MOMO",
      status: "PENDING",
      currency: "VND",
    });

    const cleanAmount = Math.round(Number(realMoney));
    const paymentData = await createMomoPayment(
      order.id,
      cleanAmount,
      `Nap tien vao vi user ${userId}`
    );

    if (!paymentData || !paymentData.payUrl) {
      throw new Error("Không thể lấy URL thanh toán từ Momo");
    }

    return { order, payUrl: paymentData.payUrl };
  }
  public async confirmPayment(momoParams: any): Promise<Wallet> {
    const { orderId, resultCode } = momoParams;

    // ---------------------------------------------------------
    // BƯỚC 1: Xác thực bảo mật (Security Check)
    // ---------------------------------------------------------
    // Kiểm tra xem request này có đúng là từ MoMo gửi về không
    const isValidSignature = verifyMomoSignature(momoParams);
    if (!isValidSignature) {
      throw new Error("Chữ ký không hợp lệ: Kiểm tra tính toàn vẹn thất bại.");
    }

    // Kiểm tra xem giao dịch có thành công không (resultCode = 0)
    // Lưu ý: MoMo trả về số nhưng có thể ở dạng string hoặc number tùy SDK
    if (Number(resultCode) !== 0) {
      // Nếu thất bại, có thể update status order thành FAILED tại đây nếu muốn
      throw new Error(`Thanh toán thất bại với mã kết quả: ${resultCode}`);
    }

    // ---------------------------------------------------------
    // BƯỚC 2: Kiểm tra Idempotency (Tránh xử lý lặp lại)
    // ---------------------------------------------------------
    // Tìm đơn hàng bằng ID (bao gồm cả đơn đã SUCCESS)
    const existingOrder = await this.topupOrderRepository.findById(orderId);
    
    if (!existingOrder) {
      throw new Error("Không tìm thấy đơn nạp trong cơ sở dữ liệu.");
    }

    // Nếu đơn hàng đã SUCCESS trước đó rồi -> Trả về ví ngay, không cộng tiền thêm
    if (existingOrder.status === "SUCCESS") {
      const wallet = await this.walletRepository.findWalletById(existingOrder.userId);
      if (!wallet) {
        throw new Error("Lỗi dữ liệu nghiêm trọng: Không tìm thấy ví của người dùng hiện hữu.");
      }
      return wallet;
    }

    // ---------------------------------------------------------
    // BƯỚC 3: Thực hiện Transaction (Atomic Update)
    // ---------------------------------------------------------
    const updatedWallet = await databaseService.transaction(async (tx) => {
      // (1) Update trạng thái đơn hàng -> SUCCESS
      // Lưu ý: Dùng updateStatus_InTx để đảm bảo nằm trong transaction
      await this.topupOrderRepository.updateStatus_InTx(
        existingOrder.id,
        "SUCCESS",
        tx
      );

      // (2) Cộng tiền vào ví (Increment Allowance)
      const amountNumber = existingOrder.realAmount?.toNumber() ?? 0;
      
      const wallet = await this.walletRepository.incrementAllowance_InTx(
        existingOrder.userId,
        amountNumber,
        tx
      );

      // (3) Lưu lịch sử giao dịch (Transaction History)
      await this.transactionRepository.createDeposit_InTx(
        {
          walletId: wallet.id,
          topupOrderId: existingOrder.id,
          amount: amountNumber,
          description: `MOMO Topup: ${amountNumber} VND via Payment Gateway`,
        },
        tx
      );

      return wallet;
    });

    return updatedWallet;
  }
}