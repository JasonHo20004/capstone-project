// =============================================================================
// Stripe Webhook Handler
//
// Mounted BEFORE express.json() so the Stripe signature header can be verified
// against the raw request body. Without the raw body, signature verification
// would always fail.
// =============================================================================

import { Router, type Request, type Response, type Router as IRouter } from "express";
import express from "express";
import Stripe from "stripe";
import { databaseService } from "../../services/database.service.js";
import type {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from "../../../generated/prisma/index.js";

const router: IRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

/**
 * Decrement wallet allowance and mark the originating topup REFUNDED.
 * If the user has already spent the refunded amount, allowance may go negative —
 * that is intentional (accounting truth); admin reconciliation handles it.
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  // Stripe returns major units for zero-decimal currencies (VND), minor units otherwise.
  // Stripe is configured for VND in this project, so we use the value directly.
  const refundedAmount = charge.amount_refunded;
  if (!refundedAmount || refundedAmount <= 0) return;

  await databaseService.transaction(async (tx) => {
    const topup = await tx.topupOrder.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (!topup) {
      console.warn(`[stripe-webhook] No topup matches paymentIntent ${paymentIntentId}`);
      return;
    }
    if (topup.status === ("REFUNDED" as OrderStatus)) {
      // Already processed (Stripe retries are common).
      return;
    }

    const wallet = await tx.wallet.findUnique({ where: { userId: topup.userId } });
    if (!wallet) return;

    await tx.wallet.update({
      where: { id: wallet.id },
      data: { allowance: { decrement: refundedAmount } },
    });

    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: -refundedAmount,
        transactionType: "DEPOSIT" as TransactionType,
        status: "FAILED" as TransactionStatus,
        description: `Stripe refund for topup ${topup.id}`,
        topupOrderId: topup.id,
      },
    });

    await tx.topupOrder.update({
      where: { id: topup.id },
      data: { status: "REFUNDED" as OrderStatus },
    });
  });

  console.log(`[stripe-webhook] Refunded topup for payment_intent ${paymentIntentId}`);
}

router.post(
  "/stripe",
  // Raw body is required so the signature can be verified against the exact payload.
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("[stripe-webhook] STRIPE_WEBHOOK_SECRET missing — webhook ignored");
      res.status(503).json({ received: false, error: "Webhook secret not configured" });
      return;
    }

    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      res.status(400).json({ received: false, error: "Missing stripe-signature header" });
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, secret);
    } catch (err) {
      console.error("[stripe-webhook] Signature verification failed:", err);
      res.status(400).json({ received: false, error: "Invalid signature" });
      return;
    }

    try {
      switch (event.type) {
        case "charge.refunded":
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;
        default:
          // Other events ignored for now.
          break;
      }
    } catch (err) {
      console.error(`[stripe-webhook] Handler failed for ${event.type}:`, err);
      // Return 500 so Stripe retries — but only for handler errors, not signature errors.
      res.status(500).json({ received: false });
      return;
    }

    res.json({ received: true });
  }
);

export default router;
