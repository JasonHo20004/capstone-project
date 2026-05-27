-- =============================================================================
-- Add coupons + coupon_redemptions + order discount columns
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "subtotal"     DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS "discount"     DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "coupon_id"    UUID,
  ADD COLUMN IF NOT EXISTS "coupon_code"  VARCHAR(40);

CREATE TABLE IF NOT EXISTS "coupons" (
  "id"                UUID NOT NULL DEFAULT gen_random_uuid(),
  "code"              VARCHAR(40) NOT NULL,
  "description"       TEXT,
  "discount_type"     "CouponType" NOT NULL,
  "discount_value"    DECIMAL(12, 2) NOT NULL,
  "max_discount"      DECIMAL(12, 2),
  "min_order_amount"  DECIMAL(12, 2) NOT NULL DEFAULT 0,
  "max_redemptions"   INTEGER,
  "max_per_user"      INTEGER,
  "used_count"        INTEGER NOT NULL DEFAULT 0,
  "starts_at"         TIMESTAMPTZ(6),
  "expires_at"        TIMESTAMPTZ(6),
  "is_active"         BOOLEAN NOT NULL DEFAULT true,
  "created_by_id"     UUID,
  "created_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "updated_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "coupons_code_key" ON "coupons"("code");
CREATE INDEX IF NOT EXISTS "coupons_is_active_expires_at_idx"
  ON "coupons"("is_active", "expires_at");

CREATE TABLE IF NOT EXISTS "coupon_redemptions" (
  "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
  "coupon_id"   UUID NOT NULL,
  "user_id"     UUID NOT NULL,
  "order_id"    UUID NOT NULL,
  "amount"      DECIMAL(12, 2) NOT NULL,
  "created_at"  TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "coupon_redemptions_coupon_id_fkey"
    FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "coupon_redemptions_coupon_id_order_id_key"
  ON "coupon_redemptions"("coupon_id", "order_id");
CREATE INDEX IF NOT EXISTS "coupon_redemptions_coupon_id_user_id_idx"
  ON "coupon_redemptions"("coupon_id", "user_id");

DO $$ BEGIN
  ALTER TABLE "orders"
    ADD CONSTRAINT "orders_coupon_id_fkey"
    FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;
