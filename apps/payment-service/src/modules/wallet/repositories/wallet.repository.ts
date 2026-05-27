// =============================================================================
// Wallet Repository - Database operations for wallets
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type { Prisma, TransactionStatus, TransactionType } from "../../../../generated/prisma/index.js";

export class WalletRepository {
  private prisma = databaseService.getClient();

  async findByUserId(userId: string) {
    return await this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async findManyByUserIds(userIds: string[]) {
    if (userIds.length === 0) return [];
    return await this.prisma.wallet.findMany({
      where: { userId: { in: userIds } },
      select: {
        id: true,
        userId: true,
        allowance: true,
        pendingBalance: true,
      },
    });
  }

  async create(userId: string) {
    return await this.prisma.wallet.create({
      data: {
        userId,
        allowance: 0,
      },
    });
  }

  async getOrCreate(userId: string) {
    let wallet = await this.findByUserId(userId);
    if (!wallet) {
      wallet = await this.create(userId);
    }
    return wallet;
  }

  async updateBalance(walletId: string, amount: number) {
    return await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        allowance: { increment: amount },
      },
    });
  }

  async createTransaction(data: {
    walletId: string;
    amount: number;
    transactionType: TransactionType;
    status: TransactionStatus;
    description?: string;
    orderId?: string;
    topupOrderId?: string;
  }) {
    return await this.prisma.transaction.create({
      data: {
        walletId: data.walletId,
        amount: data.amount,
        transactionType: data.transactionType,
        status: data.status,
        description: data.description,
        orderId: data.orderId,
        topupOrderId: data.topupOrderId,
      },
    });
  }

  async getTransactions(walletId: string, options?: { skip?: number; take?: number }) {
    return await this.prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });
  }
}
