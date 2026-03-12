DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'PaymentMethod'
      AND n.nspname = 'payment_db'
      AND e.enumlabel = 'STRIPE'
  ) THEN
    ALTER TYPE payment_db."PaymentMethod" ADD VALUE 'STRIPE';
  END IF;
END $$;

UPDATE payment_db.topup_orders
SET payment_method = 'STRIPE'
WHERE payment_method = 'MOMO';

ALTER TABLE payment_db.topup_orders
  ADD COLUMN IF NOT EXISTS stripe_client_secret VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'payment_db'
      AND indexname = 'topup_orders_stripe_payment_intent_id_key'
  ) THEN
    CREATE UNIQUE INDEX topup_orders_stripe_payment_intent_id_key
      ON payment_db.topup_orders (stripe_payment_intent_id)
      WHERE stripe_payment_intent_id IS NOT NULL;
  END IF;
END $$;
