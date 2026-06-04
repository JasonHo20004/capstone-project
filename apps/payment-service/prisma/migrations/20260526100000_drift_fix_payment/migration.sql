-- Drift fix: aligns the payment_db migration shadow with the actual database.
-- All statements use IF EXISTS / IF NOT EXISTS guards and are idempotent.

-- ── 1. transactions: drop subscription_contract_id FK + column first ──────────
-- Must happen before dropping subscription_contracts (which transactions references).
ALTER TABLE "transactions"
    DROP CONSTRAINT IF EXISTS "transactions_subscription_contract_id_fkey";
ALTER TABLE "transactions"
    DROP COLUMN IF EXISTS "subscription_contract_id";

-- ── 2. subscription_contracts: drop its own FK then the table ─────────────────
ALTER TABLE "subscription_contracts"
    DROP CONSTRAINT IF EXISTS "subscription_contracts_subscription_plan_id_fkey";
DROP TABLE IF EXISTS "subscription_contracts";

-- ── 3. subscription_plans: drop table ────────────────────────────────────────
DROP TABLE IF EXISTS "subscription_plans";

-- ── 4. cart_items.price_at_time: DOUBLE PRECISION → DECIMAL(12,2) ─────────────
ALTER TABLE "cart_items"
    ALTER COLUMN "price_at_time" TYPE DECIMAL(12,2)
        USING "price_at_time"::DECIMAL(12,2);

-- ── 5. orders.total_amount: DOUBLE PRECISION → DECIMAL(12,2) ─────────────────
ALTER TABLE "orders"
    ALTER COLUMN "total_amount" TYPE DECIMAL(12,2)
        USING "total_amount"::DECIMAL(12,2);

-- ── 6. topup_orders: remove stripe columns/index, add vnpay columns/index ─────
DROP INDEX IF EXISTS "topup_orders_stripe_payment_intent_id_key";
ALTER TABLE "topup_orders"
    DROP COLUMN IF EXISTS "stripe_client_secret",
    DROP COLUMN IF EXISTS "stripe_payment_intent_id";
ALTER TABLE "topup_orders"
    ADD COLUMN IF NOT EXISTS "vnpay_txn_ref"        VARCHAR(255),
    ADD COLUMN IF NOT EXISTS "vnpay_transaction_no"  VARCHAR(255),
    ADD COLUMN IF NOT EXISTS "vnpay_bank_code"       VARCHAR(50);
CREATE UNIQUE INDEX IF NOT EXISTS "topup_orders_vnpay_txn_ref_key"
    ON "topup_orders"("vnpay_txn_ref");

-- ── 7. user_plans.features: drop DEFAULT '{}' (Prisma manages this in code) ───
ALTER TABLE "user_plans"
    ALTER COLUMN "features" DROP DEFAULT;

-- ── 8. wallets: add pending_balance ──────────────────────────────────────────
ALTER TABLE "wallets"
    ADD COLUMN IF NOT EXISTS "pending_balance" DECIMAL(12,2) NOT NULL DEFAULT 0.00;
