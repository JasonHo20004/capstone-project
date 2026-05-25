-- Add CANCELLED to the WithdrawalRequestStatus enum
ALTER TYPE "WithdrawalRequestStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

-- Add cancel/retry tracking columns
ALTER TABLE "withdrawal_requests"
  ADD COLUMN IF NOT EXISTS "cancelled_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "retried_from_id" UUID;

CREATE INDEX IF NOT EXISTS "withdrawal_requests_seller_id_created_at_idx"
  ON "withdrawal_requests"("seller_id", "created_at");
