import Stripe from "stripe";

export interface StripeCreateSessionParams {
  amount: number;
  topupOrderId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export class StripeService {
  private readonly client: Stripe;
  private readonly currency: string;

  constructor() {
    const secret = process.env.STRIPE_SECRET_KEY ?? "";
    if (!secret) {
      console.warn("[Stripe] STRIPE_SECRET_KEY is not set");
    }
    this.client = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
    this.currency = (process.env.STRIPE_CURRENCY ?? "vnd").toLowerCase();
  }

  async createCheckoutSession(params: StripeCreateSessionParams): Promise<Stripe.Checkout.Session> {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe chưa được cấu hình (thiếu STRIPE_SECRET_KEY trong .env)");
    }

    const { amount, topupOrderId, userId, successUrl, cancelUrl } = params;

    // VND is a zero-decimal currency in Stripe — pass the actual amount, not multiplied.
    const unitAmount = this.currency === "vnd" ? Math.round(amount) : Math.round(amount * 100);

    return this.client.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: this.currency,
            product_data: { name: "Nạp tiền ví" },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { topupOrderId, userId },
      client_reference_id: topupOrderId,
    });
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.client.checkout.sessions.retrieve(sessionId);
  }
}

export const stripeService = new StripeService();
