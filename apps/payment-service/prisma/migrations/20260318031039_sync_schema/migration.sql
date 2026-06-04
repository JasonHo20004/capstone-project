/*
  Warnings:

  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `topup_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "topup_orders_stripe_payment_intent_id_key" ON "topup_orders"("stripe_payment_intent_id");
