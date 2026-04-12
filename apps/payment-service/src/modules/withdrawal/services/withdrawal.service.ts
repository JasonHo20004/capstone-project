// =============================================================================
// Withdrawal Service - Manual Payouts
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import type {
  TransactionType,
  TransactionStatus,
  WithdrawalRequestStatus,
} from "../../../../generated/prisma/index.js";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export class WithdrawalService {
  private prisma = databaseService.getClient();

  // ── [SELLER] Request a withdrawal ─────────────────────────────────────────

  async requestWithdrawal(sellerId: string, amount: number, bankDetails: BankDetails) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    return await databaseService.transaction(async (tx) => {
      // 1. Read wallet INSIDE the transaction for proper isolation
      const wallet = await tx.wallet.findUnique({ where: { userId: sellerId } });

      if (!wallet) {
        throw new Error("Wallet not found. Please contact support.");
      }

      if (Number(wallet.allowance) < amount) {
        throw new Error("Insufficient allowance balance to withdraw");
      }

      // 2. Deduct from allowance immediately
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { decrement: amount } },
      });

      // 3. Create withdrawal request
      const request = await tx.withdrawalRequest.create({
        data: {
          sellerId,
          amount,
          bankName: bankDetails.bankName,
          accountName: bankDetails.accountName,
          accountNumber: bankDetails.accountNumber,
          status: "PENDING" as WithdrawalRequestStatus,
        },
      });

      // 4. Log a "PENDING" transaction — embed request.id for reliable matching later
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: amount * -1,
          transactionType: "WITHDRAW" as TransactionType,
          status: "PENDING" as TransactionStatus,
          description: `[WR:${request.id}] Withdrawal request to ${bankDetails.bankName} (${bankDetails.accountNumber}): processing...`,
        },
      });

      return request;
    });
  }

  // ── [ADMIN] Approve a withdrawal ──────────────────────────────────────────

  async approveWithdrawal(requestId: string, proofImageUrl?: string, adminNote?: string) {
    return await databaseService.transaction(async (tx) => {
      const request = await tx.withdrawalRequest.findUnique({ where: { id: requestId } });
      if (!request) throw new Error("Withdrawal request not found");
      if (request.status !== "PENDING") throw new Error(`Request is already ${request.status}`);

      // Update status to APPROVED
      const updatedReq = await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED" as WithdrawalRequestStatus,
          proofImageUrl,
          adminNote,
          processedAt: new Date(),
        },
      });

      // Find the wallet inside tx
      const wallet = await tx.wallet.findUnique({ where: { userId: request.sellerId } });
      if (!wallet) throw new Error("Seller wallet not found");

      // Update related PENDING transaction to SUCCESS using the embedded request ID
      await tx.transaction.updateMany({
        where: {
          walletId: wallet.id,
          transactionType: "WITHDRAW" as TransactionType,
          status: "PENDING",
          description: { contains: `[WR:${requestId}]` },
        },
        data: {
          status: "SUCCESS" as TransactionStatus,
          description: `[WR:${requestId}] Withdrawal completed to ${request.bankName} (${request.accountNumber})`,
        },
      });

      return updatedReq;
    });
  }

  // ── [ADMIN] Reject a withdrawal ───────────────────────────────────────────

  async rejectWithdrawal(requestId: string, adminNote: string) {
    if (!adminNote) {
      throw new Error("Rejection reason is required");
    }

    return await databaseService.transaction(async (tx) => {
      const request = await tx.withdrawalRequest.findUnique({ where: { id: requestId } });
      if (!request) throw new Error("Withdrawal request not found");
      if (request.status !== "PENDING") throw new Error(`Request is already ${request.status}`);

      // Update status to REJECTED
      const updatedReq = await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED" as WithdrawalRequestStatus,
          adminNote,
          processedAt: new Date(),
        },
      });

      // Find wallet inside tx
      const wallet = await tx.wallet.findUnique({ where: { userId: request.sellerId } });
      if (!wallet) throw new Error("Seller wallet not found");

      // Return funds back to allowance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { increment: request.amount } },
      });

      // Mark the PENDING transaction as FAILED using embedded request ID
      await tx.transaction.updateMany({
        where: {
          walletId: wallet.id,
          transactionType: "WITHDRAW" as TransactionType,
          status: "PENDING",
          description: { contains: `[WR:${requestId}]` },
        },
        data: {
          status: "FAILED" as TransactionStatus,
          description: `[WR:${requestId}] Withdrawal rejected: ${adminNote}`,
        },
      });

      // Create an explicit refund transaction so the seller sees money returned in history
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: request.amount, // Positive — funds returned
          transactionType: "DEPOSIT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: `[WR:${requestId}] Refund for rejected withdrawal: ${adminNote}`,
        },
      });

      return updatedReq;
    });
  }

  // ── Get Withdrawal Information ───────────────────────────────────────────

  async getSellerWithdrawals(sellerId: string, page: number = 1, limit: number = 10) {
    const [requests, total] = await Promise.all([
      this.prisma.withdrawalRequest.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.withdrawalRequest.count({ where: { sellerId } }),
    ]);

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminWithdrawalRequests(page: number = 1, limit: number = 10, status?: WithdrawalRequestStatus) {
    const where = status ? { status } : {};

    const [requests, total] = await Promise.all([
      this.prisma.withdrawalRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.withdrawalRequest.count({ where }),
    ]);

    return {
      data: requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminWithdrawalSummary() {
    const [pendingRows, approvedRows, rejectedRows, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        this.prisma.withdrawalRequest.aggregate({
          where: { status: "PENDING" as WithdrawalRequestStatus },
          _sum: { amount: true },
        }),
        this.prisma.withdrawalRequest.aggregate({
          where: { status: "APPROVED" as WithdrawalRequestStatus },
          _sum: { amount: true },
        }),
        this.prisma.withdrawalRequest.aggregate({
          where: { status: "REJECTED" as WithdrawalRequestStatus },
          _sum: { amount: true },
        }),
        this.prisma.withdrawalRequest.count({
          where: { status: "PENDING" as WithdrawalRequestStatus },
        }),
        this.prisma.withdrawalRequest.count({
          where: { status: "APPROVED" as WithdrawalRequestStatus },
        }),
        this.prisma.withdrawalRequest.count({
          where: { status: "REJECTED" as WithdrawalRequestStatus },
        }),
      ]);

    return {
      totalPendingAmount: Number(pendingRows._sum.amount ?? 0),
      totalApprovedAmount: Number(approvedRows._sum.amount ?? 0),
      totalRejectedAmount: Number(rejectedRows._sum.amount ?? 0),
      pendingCount,
      approvedCount,
      rejectedCount,
      totalCount: pendingCount + approvedCount + rejectedCount,
    };
  }
}
