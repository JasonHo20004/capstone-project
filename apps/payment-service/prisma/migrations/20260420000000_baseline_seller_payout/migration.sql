-- Baseline migration: captures seller/payout models present in schema.prisma
-- but absent from migration history. All DDL uses IF NOT EXISTS / DO-EXCEPTION
-- guards so it is safe to apply against a database where these objects already exist.

-- ── Add missing values to existing enums ─────────────────────────────────────
ALTER TYPE "OrderStatus"     ADD VALUE IF NOT EXISTS 'REFUNDED';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'SUBSCRIPTION';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'COMMISSION';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'SELLER_EARNING';
ALTER TYPE "PaymentMethod"   ADD VALUE IF NOT EXISTS 'VNPAY';

-- ── New enums ─────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "UserPlanType" AS ENUM ('FREE', 'PRO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'AVAILABLE', 'RELEASED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- WithdrawalRequestStatus without CANCELLED — that value is added by the next
-- migration (20260525100000_withdrawal_cancel_retry).
DO $$ BEGIN
  CREATE TYPE "WithdrawalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── user_plans ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "user_plans" (
    "id"          UUID            NOT NULL DEFAULT gen_random_uuid(),
    "name"        VARCHAR(100)    NOT NULL,
    "type"        "UserPlanType"  NOT NULL,
    "price"       DECIMAL(12,2)   NOT NULL DEFAULT 0,
    "description" TEXT,
    "features"    TEXT[]          NOT NULL DEFAULT '{}',
    "is_active"   BOOLEAN         NOT NULL DEFAULT true,
    "created_at"  TIMESTAMPTZ(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMPTZ(6),
    CONSTRAINT "user_plans_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_plans_name_key" ON "user_plans"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "user_plans_type_key" ON "user_plans"("type");

-- ── user_subscriptions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
    "id"         UUID           NOT NULL DEFAULT gen_random_uuid(),
    "user_id"    UUID           NOT NULL,
    "plan_id"    UUID           NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date"   TIMESTAMPTZ(6),
    "is_active"  BOOLEAN        NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  ALTER TABLE "user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_plan_id_fkey"
    FOREIGN KEY ("plan_id") REFERENCES "user_plans"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── seller_earnings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "seller_earnings" (
    "id"                UUID           NOT NULL DEFAULT gen_random_uuid(),
    "seller_id"         UUID           NOT NULL,
    "course_id"         UUID           NOT NULL,
    "order_id"          UUID           NOT NULL,
    "buyer_id"          UUID           NOT NULL,
    "total_amount"      DECIMAL(12,2)  NOT NULL,
    "gateway_fee"       DECIMAL(12,2)  NOT NULL DEFAULT 0,
    "net_amount"        DECIMAL(12,2)  NOT NULL DEFAULT 0,
    "commission_rate"   DECIMAL(5,4)   NOT NULL,
    "commission_amount" DECIMAL(12,2)  NOT NULL,
    "seller_amount"     DECIMAL(12,2)  NOT NULL,
    "status"            "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "available_at"      TIMESTAMPTZ(6) NOT NULL,
    "released_at"       TIMESTAMPTZ(6),
    "created_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seller_earnings_pkey" PRIMARY KEY ("id")
);

-- ── commission_configs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "commission_configs" (
    "id"                UUID          NOT NULL DEFAULT gen_random_uuid(),
    "seller_id"         UUID,
    "commission_rate"   DECIMAL(5,4)  NOT NULL DEFAULT 0.3000,
    "gateway_fee_rate"  DECIMAL(5,4)  NOT NULL DEFAULT 0.0300,
    "gateway_fee_fixed" DECIMAL(12,2) NOT NULL DEFAULT 2000,
    "clearance_days"    INTEGER       NOT NULL DEFAULT 7,
    "updated_at"        TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "commission_configs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "commission_configs_seller_id_key"
    ON "commission_configs"("seller_id");

-- ── withdrawal_requests ───────────────────────────────────────────────────────
-- cancelled_at and retried_from_id are intentionally omitted here; they are
-- added by migration 20260525100000_withdrawal_cancel_retry.
CREATE TABLE IF NOT EXISTS "withdrawal_requests" (
    "id"              UUID                      NOT NULL DEFAULT gen_random_uuid(),
    "seller_id"       UUID                      NOT NULL,
    "amount"          DECIMAL(12,2)             NOT NULL,
    "bank_name"       TEXT                      NOT NULL,
    "account_name"    TEXT                      NOT NULL,
    "account_number"  TEXT                      NOT NULL,
    "status"          "WithdrawalRequestStatus" NOT NULL DEFAULT 'PENDING',
    "proof_image_url" TEXT,
    "admin_note"      TEXT,
    "created_at"      TIMESTAMPTZ(6)            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at"    TIMESTAMPTZ(6),
    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);
