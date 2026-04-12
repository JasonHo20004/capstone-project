-- Add STRIPE enum value (must be committed before use)
ALTER TYPE payment_db."PaymentMethod" ADD VALUE IF NOT EXISTS 'STRIPE';

-- Use text cast to avoid "unsafe use of new enum value" in same transaction
UPDATE payment_db.topup_orders
SET payment_method = 'STRIPE'::text::payment_db."PaymentMethod"
WHERE payment_method = 'MOMO';

ALTER TABLE payment_db.topup_orders
  ADD COLUMN IF NOT EXISTS stripe_client_secret VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

