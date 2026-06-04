-- =============================================================================
-- Add UserStatus + AdminAuditLog
-- =============================================================================

-- CreateEnum: UserStatus
DO $$ BEGIN
  CREATE TYPE "identity_db"."UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'DELETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateEnum: AdminAuditAction
DO $$ BEGIN
  CREATE TYPE "identity_db"."AdminAuditAction" AS ENUM (
    'WALLET_ADJUST',
    'USER_STATUS_CHANGE',
    'USER_DELETE',
    'APPLICATION_APPROVE',
    'APPLICATION_REJECT',
    'COURSE_APPROVE',
    'COURSE_REJECT',
    'COMMENT_MODERATE',
    'WITHDRAWAL_APPROVE',
    'WITHDRAWAL_REJECT',
    'REFUND_APPROVE',
    'REFUND_REJECT',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateEnum: AdminAuditEntity
DO $$ BEGIN
  CREATE TYPE "identity_db"."AdminAuditEntity" AS ENUM (
    'USER',
    'WALLET',
    'APPLICATION',
    'COURSE',
    'COMMENT',
    'WITHDRAWAL',
    'REFUND',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AlterTable: users — add moderation fields
ALTER TABLE "identity_db"."users"
  ADD COLUMN IF NOT EXISTS "user_status" "identity_db"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "suspended_until" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "status_reason" TEXT;

-- CreateTable: admin_audit_logs
CREATE TABLE IF NOT EXISTS "identity_db"."admin_audit_logs" (
  "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
  "actor_id"     UUID NOT NULL,
  "actor_email"  VARCHAR(100) NOT NULL,
  "action"       "identity_db"."AdminAuditAction" NOT NULL,
  "entity_type"  "identity_db"."AdminAuditEntity" NOT NULL,
  "entity_id"    VARCHAR(100),
  "reason"       TEXT,
  "metadata"     JSONB,
  "ip_address"   VARCHAR(45),
  "created_at"   TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- Indexes for common query paths
CREATE INDEX IF NOT EXISTS "admin_audit_logs_created_at_idx"
  ON "identity_db"."admin_audit_logs" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "admin_audit_logs_actor_id_idx"
  ON "identity_db"."admin_audit_logs" ("actor_id");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_entity_type_entity_id_idx"
  ON "identity_db"."admin_audit_logs" ("entity_type", "entity_id");
