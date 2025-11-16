import { UserRepository } from "@/modules/users/repositories/user.repository";

import { databaseService } from "@/services/database.service";
import { WalletRepository } from "@/modules/users/repositories/wallet.repository";
import type { TopupOrder, Wallet } from "@/../generated/prisma";
import { TopupOrderRepository } from "@/modules/topupOrders/repositories/topupOrder.repository";
import { TransactionRepository } from "@/modules/transactions/repositories/transaction.repository";
export class TopupOrderService {
  private topupOrderRepository = new TopupOrderRepository();
  private userRepository = new UserRepository();
  private walletRepository = new WalletRepository();
  private transactionRepository = new TransactionRepository();
  public async createTopupOrder(
    userId: string,
    realMoney: number
  ): Promise<TopupOrder> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("User is not existence");
    }

    const existingPendingTopupOrder =
      await this.topupOrderRepository.findPendingTopupOrderById(userId);
    if (existingPendingTopupOrder) {
      throw Error("Topup of this User is PENDING");
    }
    return this.topupOrderRepository.createOrder({
      userId: userId,
      realMoney: realMoney,
      realAmount: realMoney / 1000, // 1:1000
      paymentMethod: "MOMO",
      status: "PENDING",
      currency: "VND",
    });
  }
  public async confirmPayment(orderId: string):Promise<Wallet> {
    // 1. Service call transaction
    const updatedWallet = await databaseService.transaction(async (tx) => {
      const order =
        await this.topupOrderRepository.findPendingTopupOrderById_InTx(
          orderId,
          tx
        );
      if (!order) {
        throw new Error("Order not found or already processed.");
      }

      // (1) Update order
      await this.topupOrderRepository.updateStatus_InTx(
        order.id,
        "SUCCESS",
        tx
      );

      // (2) Increase money
      const amountNumber = order.realAmount?.toNumber() ?? 0;

      const wallet = await this.walletRepository.incrementAllowance_InTx(
        order.userId,
        amountNumber,
        tx
      );

      // (3) Transaction
      await this.transactionRepository.createDeposit_InTx(
        {
          walletId: wallet.id,
          topupOrderId: order.id,
          amount: amountNumber,
          description: `[DEV] Topup ${amountNumber} (simulated)`,
        },
        tx
      );

      return wallet;
    });

    return updatedWallet;
  }
}
