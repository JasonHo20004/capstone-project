import { BadRequestError } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { stripeService } from "../../../services/stripe.service.js";
import type {
  OrderStatus,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "../../../../generated/prisma/index.js";

const MINIMUM_TOPUP_VND = 10000;

export class TopupService {
  private prisma = databaseService.getClient();

  async createOrder(userId: string, realMoney: number) {
    if (!Number.isFinite(realMoney) || realMoney < MINIMUM_TOPUP_VND) {
      throw new BadRequestError(
        `Số tiền nạp tối thiểu là ${MINIMUM_TOPUP_VND.toLocaleString("vi-VN")} VND.`
      );
    }

    const normalizedAmount = Math.round(realMoney);

    const topupOrder = await this.prisma.topupOrder.create({
      data: {
        userId,
        realMoney: normalizedAmount,
        paymentMethod: "STRIPE" as PaymentMethod,
        status: "PENDING" as OrderStatus,
      },
    });

    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3000";
    const session = await stripeService.createCheckoutSession({
      amount: normalizedAmount,
      topupOrderId: topupOrder.id,
      userId,
      successUrl: `${backendUrl}/api/topup-orders/stripe-return`,
      cancelUrl: `${backendUrl}/api/topup-orders/stripe-cancel`,
    });

    await this.prisma.topupOrder.update({
      where: { id: topupOrder.id },
      data: { stripeSessionId: session.id },
    });

    if (!session.url) {
      throw new Error("Stripe session created without URL");
    }

    return {
      orderId: topupOrder.id,
      paymentUrl: session.url,
      txnRef: session.id,
      amount: normalizedAmount,
      currency: "VND",
      minimumAmount: MINIMUM_TOPUP_VND,
    };
  }

  async confirmStripeSession(sessionId: string) {
    const session = await stripeService.retrieveSession(sessionId);

    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (!topupOrder) {
      return { success: false, message: "Không tìm thấy đơn nạp tiền", txnRef: sessionId };
    }

    const isPaid = session.payment_status === "paid";
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const paymentMethodType =
      session.payment_method_types?.[0] ?? undefined;

    if (isPaid) {
      // Credit wallet — idempotent via updateMany guard.
      await this.processSuccessfulPayment(
        topupOrder,
        Number(topupOrder.realMoney),
        paymentIntentId,
        paymentMethodType
      );
    } else if (topupOrder.status === "PENDING") {
      await this.prisma.topupOrder.update({
        where: { id: topupOrder.id },
        data: { status: "FAILED" as OrderStatus },
      });
    }

    return {
      success: isPaid,
      orderId: topupOrder.id,
      status: isPaid ? "SUCCESS" : "FAILED",
      amount: Number(topupOrder.realMoney),
      message: isPaid ? "Thanh toán thành công" : "Thanh toán thất bại",
      txnRef: sessionId,
    };
  }

  async cancelStripeSession(sessionId: string) {
    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (topupOrder && topupOrder.status === "PENDING") {
      await this.prisma.topupOrder.update({
        where: { id: topupOrder.id },
        data: { status: "FAILED" as OrderStatus },
      });
    }

    return {
      success: false,
      orderId: topupOrder?.id ?? "",
      status: "FAILED",
      amount: topupOrder ? Number(topupOrder.realMoney) : 0,
      message: "Bạn đã huỷ thanh toán",
      txnRef: sessionId,
    };
  }

  private async processSuccessfulPayment(
    topupOrder: { id: string; userId: string; realMoney: unknown },
    amount: number,
    paymentIntentId: string | undefined,
    paymentMethodType: string | undefined
  ) {
    const userId = topupOrder.userId;

    await databaseService.transaction(async (tx) => {
      const updateResult = await tx.topupOrder.updateMany({
        where: { id: topupOrder.id, status: "PENDING" as OrderStatus },
        data: {
          status: "SUCCESS" as OrderStatus,
          realAmount: amount,
          stripePaymentIntentId: paymentIntentId,
          stripePaymentMethodType: paymentMethodType,
        },
      });

      if (updateResult.count === 0) {
        console.log("[topup] already processed, skipping", topupOrder.id);
        return;
      }

      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({ data: { userId, allowance: 0 } });
      }

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
          description: `Nạp tiền qua Stripe (Order: ${topupOrder.id})`,
          topupOrderId: topupOrder.id,
        },
      });

      console.log("[topup] wallet updated", { userId, amount });
    });
  }

  async getOrderStatus(orderId: string, userId: string) {
    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { id: orderId },
    });

    if (!topupOrder) {
      throw new Error("Topup order not found");
    }

    if (topupOrder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return {
      id: topupOrder.id,
      status: topupOrder.status,
      paymentMethod: topupOrder.paymentMethod,
      amount: Number(topupOrder.realMoney),
      txnRef: topupOrder.stripeSessionId,
    };
  }
}
