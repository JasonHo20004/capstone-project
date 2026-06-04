-- =============================================================================
-- Add RefundRequest workflow
-- =============================================================================

-- CreateEnum: RefundRequestStatus
DO $$ BEGIN
  CREATE TYPE "RefundRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable: refund_requests
CREATE TABLE IF NOT EXISTS "refund_requests" (
  "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
  "order_id"       UUID NOT NULL,
  "requester_id"   UUID NOT NULL,
  "amount"         DECIMAL(12, 2) NOT NULL,
  "reason"         TEXT NOT NULL,
  "status"         "RefundRequestStatus" NOT NULL DEFAULT 'PENDING',
  "admin_id"       UUID,
  "admin_note"     TEXT,
  "created_at"     TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "processed_at"   TIMESTAMPTZ(6),
  CONSTRAINT "refund_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "refund_requests_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION
);

-- Indexes
CREATE INDEX IF NOT EXISTS "refund_requests_requester_id_created_at_idx"
  ON "refund_requests"("requester_id", "created_at");
CREATE INDEX IF NOT EXISTS "refund_requests_status_created_at_idx"
  ON "refund_requests"("status", "created_at");
