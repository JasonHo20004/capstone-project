import Stripe from "stripe";
import { BadRequestError } from "@capstone/common";
import { databaseService } from "../../../services/database.service.js";
import { stripeClient } from "../../../services/stripe.service.js";
import { WalletRepository } from "../../wallet/repositories/wallet.repository.js";
import type {
  OrderStatus,
  PaymentMethod,
  TopupOrder,
  TransactionStatus,
  TransactionType,
} from "../../../../generated/prisma/index.js";

const MINIMUM_STRIPE_TOPUP_VND = 15000;

export class TopupService {
  private prisma = databaseService.getClient();
  private walletRepository = new WalletRepository();

  async createOrder(userId: string, realMoney: number) {
    if (!Number.isFinite(realMoney) || realMoney < MINIMUM_STRIPE_TOPUP_VND) {
      throw new BadRequestError(
        `Số tiền nạp tối thiểu là ${MINIMUM_STRIPE_TOPUP_VND.toLocaleString("vi-VN")} VND để đáp ứng mức tối thiểu của Stripe.`
      );
    }

    const normalizedAmount = Math.round(realMoney);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: normalizedAmount,
      currency: "vnd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        realMoney: String(normalizedAmount),
      },
    });

    const topupOrder = await this.prisma.topupOrder.create({
      data: {
        userId,
        realMoney: normalizedAmount,
        paymentMethod: "STRIPE" as PaymentMethod,
        status: "PENDING" as OrderStatus,
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
      },
    });

    return {
      orderId: topupOrder.id,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      amount: normalizedAmount,
      currency: "vnd",
      minimumAmount: MINIMUM_STRIPE_TOPUP_VND,
    };
  }

  async handleWebhook(signature: string | undefined, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log("[topup:webhook] incoming", {
      hasSignature: Boolean(signature),
      hasWebhookSecret: Boolean(webhookSecret),
      payloadLength: payload.length,
    });

    if (!signature || !webhookSecret) {
      throw new Error("Stripe webhook is not configured correctly");
    }

    let event: Stripe.Event;

    try {
      // In dev: use large tolerance to bypass clock skew. In prod: default 300s.
      const tolerance = process.env.NODE_ENV === "development" ? 99999999 : 300;
      event = stripeClient.webhooks.constructEvent(payload, signature, webhookSecret, tolerance);
    } catch (error) {
      console.error("[topup:webhook] constructEvent failed", error);
      throw error;
    }

    console.log("[topup:webhook] event constructed", {
      type: event.type,
      id: event.id,
    });

    if (event.type === "payment_intent.succeeded") {
      await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
    }

    if (event.type === "payment_intent.payment_failed") {
      await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
    }

    return { received: true };
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log("[topup:webhook] handlePaymentIntentSucceeded", paymentIntent.id);

    const topupOrder = await this.prisma.topupOrder.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (!topupOrder) {
      console.warn("[topup:webhook] topupOrder not found for paymentIntent", paymentIntent.id);
      return;
    }

    const creditedAmount = Number(topupOrder.realMoney);
    const userId = topupOrder.userId;

    await databaseService.transaction(async (tx) => {
      const updateResult = await tx.topupOrder.updateMany({
        where: {
          id: topupOrder.id,
          status: "PENDING" as OrderStatus,
        },
        data: {
          status: "SUCCESS" as OrderStatus,
          realAmount: creditedAmount,
        },
      });

      if (updateResult.count === 0) {
        console.log("[topup:webhook] already processed, skipping", topupOrder.id);
        return;
      }

      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({ data: { userId, allowance: 0 } });
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          allowance: { increment: creditedAmount },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: creditedAmount,
          transactionType: "DEPOSIT" as TransactionType,
          status: "SUCCESS" as TransactionStatus,
          description: `Top-up via Stripe (${paymentIntent.id})`,
          topupOrderId: topupOrder.id,
        },
      });

      console.log("[topup:webhook] success - wallet updated", { userId, creditedAmount });
    });
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    await this.prisma.topupOrder.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: "PENDING" as OrderStatus,
      },
      data: {
        status: "FAILED" as OrderStatus,
      },
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
      clientSecret: topupOrder.stripeClientSecret,
      paymentIntentId: topupOrder.stripePaymentIntentId,
    };
  }
}
