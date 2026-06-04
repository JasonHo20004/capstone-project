// =============================================================================
// Withdrawal Service - Manual Payouts
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import { getSellerStatus } from "../../../clients/identity.client.js";
import {
  EventBusService,
  EventNames,
  type WithdrawalRequestedEvent,
  type WithdrawalApprovedEvent,
  type WithdrawalRejectedEvent,
} from "@capstone/common";
import type {
  TransactionType,
  TransactionStatus,
  WithdrawalRequestStatus,
} from "../../../../generated/prisma/index.js";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  /** NAPAS bank BIN (6 digits) — drives the VietQR shown to admin on approval. */
  bankBin?: string | null;
}

// Withdrawal limits (VND). Override via env if business rules change.
const MIN_WITHDRAWAL_AMOUNT = Number(process.env.MIN_WITHDRAWAL_AMOUNT ?? 50_000);
const MAX_WITHDRAWAL_AMOUNT = Number(process.env.MAX_WITHDRAWAL_AMOUNT ?? 50_000_000);

export class WithdrawalService {
  private prisma = databaseService.getClient();
  private eventBus = EventBusService.getInstance("payment-service");

  /** Fire-and-forget — never block the caller on a broker hiccup. */
  private emit<T>(name: EventNames, payload: T) {
    this.eventBus.publish(name, payload).catch((err) =>
      console.error(`[WithdrawalService] Failed to publish ${name}:`, err)
    );
  }

  // ── [SELLER] Request a withdrawal ─────────────────────────────────────────

  async requestWithdrawal(
    sellerId: string,
    amount: number,
    bankDetails: BankDetails,
    options?: { retriedFromId?: string }
  ) {
    if (amount < MIN_WITHDRAWAL_AMOUNT) {
      throw new Error(
        `Minimum withdrawal amount is ${MIN_WITHDRAWAL_AMOUNT.toLocaleString("vi-VN")}đ`
      );
    }
    if (amount > MAX_WITHDRAWAL_AMOUNT) {
      throw new Error(
        `Maximum withdrawal amount per request is ${MAX_WITHDRAWAL_AMOUNT.toLocaleString("vi-VN")}đ`
      );
    }

    // Bank-detail sanity checks (catch typos before admin manual transfer).
    if (!/^\d{6,20}$/.test(bankDetails.accountNumber)) {
      throw new Error("Bank account number must be 6-20 digits");
    }
    if (bankDetails.accountName.trim().length < 2) {
      throw new Error("Account name is required");
    }
    if (bankDetails.bankName.trim().length < 2) {
      throw new Error("Bank name is required");
    }
    // BIN is optional (legacy clients omit it) but must be a valid 6-digit
    // NAPAS code when present — otherwise the admin VietQR would be wrong.
    if (bankDetails.bankBin && !/^\d{6}$/.test(bankDetails.bankBin)) {
      throw new Error("Invalid bank BIN");
    }

    // Block banned/inactive sellers from cashing out.
    const sellerStatus = await getSellerStatus(sellerId);
    if (sellerStatus && sellerStatus.hasProfile && !sellerStatus.active) {
      throw new Error("Your seller account has been deactivated. Contact support.");
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

      // 3. Create withdrawal request — carry forward the source request id on
      // retry so the UI timeline can link "rút lại sau khi bị từ chối".
      const request = await tx.withdrawalRequest.create({
        data: {
          sellerId,
          amount,
          bankName: bankDetails.bankName,
          accountName: bankDetails.accountName,
          accountNumber: bankDetails.accountNumber,
          bankBin: bankDetails.bankBin ?? null,
          status: "PENDING" as WithdrawalRequestStatus,
          retriedFromId: options?.retriedFromId ?? null,
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
    }).then((request) => {
      const payload: WithdrawalRequestedEvent = {
        requestId: request.id,
        sellerId,
        amount,
        bankName: bankDetails.bankName,
        createdAt: request.createdAt,
      };
      this.emit(EventNames.WITHDRAWAL_REQUESTED, payload);
      return request;
    });
  }

  // ── [SELLER] Cancel a PENDING withdrawal ──────────────────────────────────

  /**
   * Seller-initiated cancel. Only allowed when status is still PENDING — once
   * admin has acted, the seller must contact support. Returns funds to
   * allowance + records the cancellation timestamp + flips the WR transaction
   * to FAILED (no DEPOSIT entry — symmetric with the cancel, not a refund).
   */
  async cancelWithdrawal(sellerId: string, requestId: string) {
    return await databaseService.transaction(async (tx) => {
      const request = await tx.withdrawalRequest.findUnique({ where: { id: requestId } });
      if (!request) throw new Error("Withdrawal request not found");
      if (request.sellerId !== sellerId) throw new Error("Not authorized");
      if (request.status !== "PENDING") {
        throw new Error(`Cannot cancel a request that is already ${request.status}`);
      }

      const updated = await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: {
          status: "CANCELLED" as WithdrawalRequestStatus,
          cancelledAt: new Date(),
        },
      });

      const wallet = await tx.wallet.findUnique({ where: { userId: sellerId } });
      if (!wallet) throw new Error("Seller wallet not found");

      // Return funds to allowance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { allowance: { increment: request.amount } },
      });

      // Mark the PENDING transaction FAILED (matches admin-reject semantics)
      await tx.transaction.updateMany({
        where: {
          walletId: wallet.id,
          transactionType: "WITHDRAW" as TransactionType,
          status: "PENDING",
          description: { contains: `[WR:${requestId}]` },
        },
        data: {
          status: "FAILED" as TransactionStatus,
          description: `[WR:${requestId}] Withdrawal cancelled by seller`,
        },
      });

      return updated;
    });
  }

  // ── [SELLER] Retry a REJECTED withdrawal ──────────────────────────────────

  /**
   * Convenience wrapper: re-submit a previously rejected request reusing its
   * bank details (with optional overrides). Linked back via `retriedFromId`
   * so the timeline can show "rút lại sau khi bị từ chối".
   */
  async retryWithdrawal(
    sellerId: string,
    sourceRequestId: string,
    overrides?: Partial<BankDetails & { amount: number }>
  ) {
    const source = await this.prisma.withdrawalRequest.findUnique({
      where: { id: sourceRequestId },
    });
    if (!source) throw new Error("Original withdrawal request not found");
    if (source.sellerId !== sellerId) throw new Error("Not authorized");
    if (source.status !== "REJECTED") {
      throw new Error("Only REJECTED withdrawals can be retried");
    }

    const amount = overrides?.amount ?? Number(source.amount);
    const bankDetails: BankDetails = {
      bankName: overrides?.bankName ?? source.bankName,
      accountName: overrides?.accountName ?? source.accountName,
      accountNumber: overrides?.accountNumber ?? source.accountNumber,
      bankBin: overrides?.bankBin ?? source.bankBin,
    };

    return await this.requestWithdrawal(sellerId, amount, bankDetails, {
      retriedFromId: sourceRequestId,
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
    }).then((req) => {
      const payload: WithdrawalApprovedEvent = {
        requestId: req.id,
        sellerId: req.sellerId,
        amount: Number(req.amount),
        bankName: req.bankName,
        processedAt: req.processedAt!,
        proofImageUrl: req.proofImageUrl ?? undefined,
      };
      this.emit(EventNames.WITHDRAWAL_APPROVED, payload);
      return req;
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
    }).then((req) => {
      const payload: WithdrawalRejectedEvent = {
        requestId: req.id,
        sellerId: req.sellerId,
        amount: Number(req.amount),
        reason: req.adminNote ?? "",
        processedAt: req.processedAt!,
      };
      this.emit(EventNames.WITHDRAWAL_REJECTED, payload);
      return req;
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
