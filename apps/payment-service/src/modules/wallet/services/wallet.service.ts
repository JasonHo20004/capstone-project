// =============================================================================
// Wallet Service - Business logic for wallet operations
// =============================================================================

import { WalletRepository } from "../repositories/wallet.repository.js";
import { EventBusService, EventNames } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import type { TransactionStatus, TransactionType } from "../../../../generated/prisma/index.js";

export class WalletService {
  private walletRepository = new WalletRepository();
  private eventBus: EventBusService;
  private prisma = databaseService.getClient();

  constructor() {
    this.eventBus = EventBusService.getInstance("payment-service");
  }

  async getWallet(userId: string) {
    const wallet = await this.walletRepository.getOrCreate(userId);
    return {
      id: wallet.id,
      balance: Number(wallet.allowance),
      pendingBalance: Number(wallet.pendingBalance),
      userId: wallet.userId,
    };
  }

  async getWalletsByUserIds(userIds: string[]) {
    const wallets = await this.walletRepository.findManyByUserIds(userIds);
    return wallets.map((w) => ({
      id: w.id,
      userId: w.userId,
      allowance: Number(w.allowance),
      pendingBalance: Number(w.pendingBalance),
    }));
  }

  async deposit(userId: string, amount: number, description?: string) {
    const wallet = await this.walletRepository.getOrCreate(userId);
    
    await databaseService.transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount,
          transactionType: "DEPOSIT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: description || "Deposit",
        },
      });
    });

    const updatedWallet = await this.walletRepository.findByUserId(userId);
    return {
      id: updatedWallet!.id,
      balance: Number(updatedWallet!.allowance),
      userId: updatedWallet!.userId,
    };
  }

  async deduct(userId: string, amount: number, description?: string, orderId?: string) {
    const wallet = await this.walletRepository.findByUserId(userId);
    
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (Number(wallet.allowance) < amount) {
      throw new Error("Insufficient balance");
    }

    await databaseService.transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          transactionType: "PAYMENT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: description || "Payment",
          orderId,
        },
      });
    });

    const updatedWallet = await this.walletRepository.findByUserId(userId);
    return {
      id: updatedWallet!.id,
      balance: Number(updatedWallet!.allowance),
      userId: updatedWallet!.userId,
    };
  }

  async getTransactionHistory(userId: string, page: number = 1, limit: number = 10) {
    const wallet = await this.walletRepository.findByUserId(userId);
    
    if (!wallet) {
      return { data: [], total: 0, page, limit };
    }

    const transactions = await this.walletRepository.getTransactions(wallet.id, {
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.transaction.count({
      where: { walletId: wallet.id },
    });

    return {
      data: transactions.map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        transactionType: t.transactionType,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMonthlySummary(userId: string) {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      return {
        monthlyTopupAmount: 0,
        monthlySuccessfulTransactions: 0,
      };
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyTransactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      select: {
        amount: true,
        transactionType: true,
        status: true,
      },
    });

    const monthlyTopupAmount = monthlyTransactions
      .filter((transaction) => transaction.transactionType === "DEPOSIT" && transaction.status === "SUCCESS")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const monthlySuccessfulTransactions = monthlyTransactions.filter((transaction) => transaction.status === "SUCCESS").length;

    return {
      monthlyTopupAmount,
      monthlySuccessfulTransactions,
    };
  }
}
