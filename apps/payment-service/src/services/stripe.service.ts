import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: "2026-02-25.clover",
});
