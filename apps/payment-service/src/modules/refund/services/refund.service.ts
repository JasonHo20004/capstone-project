// =============================================================================
// Refund Service — learner-initiated refund workflow
// =============================================================================

import { databaseService } from "../../../services/database.service.js";
import {
  EventBusService,
  EventNames,
  type RefundApprovedEvent,
  type RefundRejectedEvent,
} from "@capstone/common";
import type {
  Prisma,
  RefundRequestStatus,
  TransactionStatus,
  TransactionType,
  EarningStatus,
} from "../../../../generated/prisma/index.js";

interface CreateInput {
  orderId: string;
  requesterId: string;
  reason: string;
}

interface ListAdminFilters {
  page: number;
  limit: number;
  status?: RefundRequestStatus;
}

export class RefundService {
  private prisma = databaseService.getClient();
  private eventBus = EventBusService.getInstance("payment-service");

  // ── [LEARNER] Submit a refund request ────────────────────────────────────
  async createRequest(input: CreateInput) {
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
      include: { transaction: true },
    });
    if (!order) throw new Error("Đơn hàng không tồn tại");
    if (order.userId !== input.requesterId) {
      throw new Error("Bạn không có quyền yêu cầu hoàn tiền cho đơn này");
    }
    if (!order.transaction || order.transaction.status !== "SUCCESS") {
      throw new Error("Chỉ đơn hàng đã thanh toán thành công mới có thể hoàn tiền");
    }
    const existing = await this.prisma.refundRequest.findFirst({
      where: {
        orderId: input.orderId,
        requesterId: input.requesterId,
        status: { in: ["PENDING", "APPROVED", "COMPLETED"] },
      },
    });
    if (existing) {
      throw new Error("Đã có yêu cầu hoàn tiền đang xử lý cho đơn này");
    }

    return await this.prisma.refundRequest.create({
      data: {
        orderId: input.orderId,
        requesterId: input.requesterId,
        amount: order.totalAmount,
        reason: input.reason,
      },
    });
  }

  // ── [LEARNER] List my refund requests ────────────────────────────────────
  async listByRequester(requesterId: string, page = 1, limit = 20) {
    const where: Prisma.RefundRequestWhereInput = { requesterId };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.refundRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { order: true },
      }),
      this.prisma.refundRequest.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  // ── [ADMIN] List all refund requests ─────────────────────────────────────
  async listAdmin(filters: ListAdminFilters) {
    const where: Prisma.RefundRequestWhereInput = {};
    if (filters.status) where.status = filters.status;
    const skip = (filters.page - 1) * filters.limit;
    const [items, total] = await Promise.all([
      this.prisma.refundRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.limit,
        include: { order: true },
      }),
      this.prisma.refundRequest.count({ where }),
    ]);
    return { items, total, page: filters.page, limit: filters.limit };
  }

  // ── [ADMIN] Approve refund — credit learner wallet + flag earnings ──────
  async approve(refundId: string, adminId: string, adminNote?: string) {
    const refund = await this.prisma.refundRequest.findUnique({
      where: { id: refundId },
    });
    if (!refund) throw new Error("Yêu cầu hoàn tiền không tồn tại");
    if (refund.status !== "PENDING") {
      throw new Error("Yêu cầu hoàn tiền đã được xử lý");
    }

    await databaseService.transaction(async (tx) => {
      // 1. Mark refund APPROVED then transition to COMPLETED at end of tx.
      await tx.refundRequest.update({
        where: { id: refundId },
        data: {
          status: "APPROVED" as RefundRequestStatus,
          adminId,
          adminNote: adminNote ?? null,
          processedAt: new Date(),
        },
      });

      // 2. Credit learner wallet (create wallet if missing).
      const wallet = await tx.wallet.upsert({
        where: { userId: refund.requesterId },
        update: { allowance: { increment: refund.amount } },
        create: { userId: refund.requesterId, allowance: refund.amount },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: refund.amount,
          transactionType: "DEPOSIT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: `Hoàn tiền cho đơn #${refund.orderId.slice(0, 8)}`,
        },
      });

      // 3. Mark seller earnings for this order as REFUNDED so payouts skip them.
      await tx.sellerEarning.updateMany({
        where: { orderId: refund.orderId },
        data: { status: "REFUNDED" as EarningStatus },
      });

      // 4. Final state: COMPLETED (the funds have actually moved).
      await tx.refundRequest.update({
        where: { id: refundId },
        data: { status: "COMPLETED" as RefundRequestStatus },
      });
    });

    const finalRefund = await this.prisma.refundRequest.findUnique({
      where: { id: refundId },
    });

    // Publish AFTER tx commits — notification-service consumes this to push
    // an in-app notification to the learner.
    if (finalRefund) {
      const payload: RefundApprovedEvent = {
        refundId: finalRefund.id,
        orderId: finalRefund.orderId,
        requesterId: finalRefund.requesterId,
        amount: Number(finalRefund.amount),
        adminId,
        adminNote: adminNote ?? undefined,
        processedAt: finalRefund.processedAt ?? new Date(),
      };
      await this.eventBus
        .publish(EventNames.REFUND_APPROVED, payload)
        .catch((err) => console.error("[Refund] publish REFUND_APPROVED failed:", err));
    }

    return finalRefund;
  }

  // ── [ADMIN] Reject refund ────────────────────────────────────────────────
  async reject(refundId: string, adminId: string, adminNote: string) {
    const refund = await this.prisma.refundRequest.findUnique({
      where: { id: refundId },
    });
    if (!refund) throw new Error("Yêu cầu hoàn tiền không tồn tại");
    if (refund.status !== "PENDING") {
      throw new Error("Yêu cầu hoàn tiền đã được xử lý");
    }
    if (!adminNote || adminNote.trim().length < 3) {
      throw new Error("Vui lòng nhập lý do từ chối");
    }

    const updated = await this.prisma.refundRequest.update({
      where: { id: refundId },
      data: {
        status: "REJECTED" as RefundRequestStatus,
        adminId,
        adminNote: adminNote.trim(),
        processedAt: new Date(),
      },
    });

    const payload: RefundRejectedEvent = {
      refundId: updated.id,
      orderId: updated.orderId,
      requesterId: updated.requesterId,
      amount: Number(updated.amount),
      adminId,
      reason: adminNote.trim(),
      processedAt: updated.processedAt ?? new Date(),
    };
    await this.eventBus
      .publish(EventNames.REFUND_REJECTED, payload)
      .catch((err) => console.error("[Refund] publish REFUND_REJECTED failed:", err));

    return updated;
  }
}
