// =============================================================================
// Topup Service - Business logic for topup orders
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import { WalletRepository } from "../../wallet/repositories/wallet.repository.js";
import type { OrderStatus, TransactionStatus, TransactionType } from "../../../../generated/prisma/index.js";

export class TopupService {
  private prisma = databaseService.getClient();
  private walletRepository = new WalletRepository();

  async createOrder(userId: string, realMoney: number, paymentMethod: string = "MOMO") {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const topupOrder = await this.prisma.topupOrder.create({
      data: {
        userId,
        realMoney,
        paymentMethod: paymentMethod as any,
        status: "PENDING" as OrderStatus,
      },
    });

    // Mock payUrl: redirect to frontend wallet with callback params (simulates MoMo redirect)
    const payUrl = `${frontendUrl}/wallet?resultCode=0&orderId=${topupOrder.id}&message=Success`;

    return {
      orderId: topupOrder.id,
      payUrl,
    };
  }

  async confirmPayment(userId: string, params: Record<string, unknown>) {
    const orderId = params.orderId as string;
    const resultCode = params.resultCode as string | number;

    if (!orderId) {
      throw new Error("Missing orderId");
    }

    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { id: orderId },
    });

    if (!topupOrder) {
      throw new Error("Topup order not found");
    }

    if (topupOrder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (topupOrder.status === "SUCCESS") {
      const wallet = await this.walletRepository.getOrCreate(userId);
      return {
        id: wallet.id,
        allowance: Number(wallet.allowance),
        userId: wallet.userId,
      };
    }

    const isSuccess = String(resultCode) === "0";

    if (isSuccess) {
      const wallet = await this.walletRepository.getOrCreate(userId);

      await databaseService.transaction(async (tx) => {
        await tx.topupOrder.update({
          where: { id: orderId },
          data: { status: "SUCCESS" as OrderStatus, realAmount: topupOrder.realMoney },
        });

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { allowance: { increment: Number(topupOrder.realMoney) } },
        });

        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            amount: Number(topupOrder.realMoney),
            transactionType: "DEPOSIT" as TransactionType,
            status: "SUCCESS" as TransactionStatus,
            description: "Top-up via " + topupOrder.paymentMethod,
            topupOrderId: orderId,
          },
        });
      });
    } else {
      await this.prisma.topupOrder.update({
        where: { id: orderId },
        data: { status: "FAILED" as OrderStatus },
      });
      throw new Error("Payment failed");
    }

    const updatedWallet = await this.walletRepository.getOrCreate(userId);
    return {
      id: updatedWallet.id,
      allowance: Number(updatedWallet.allowance),
      userId: updatedWallet.userId,
    };
  }
}
