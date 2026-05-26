-- =============================================================================
-- Drift baseline: captures DB changes made outside migrations.
-- All DDL uses IF NOT EXISTS / DO-block guards so re-running is safe.
-- =============================================================================

-- 1. OutboxStatus enum
DO $$ BEGIN
  CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. notification_outbox table
CREATE TABLE IF NOT EXISTS "notification_outbox" (
  "id"           UUID           NOT NULL DEFAULT gen_random_uuid(),
  "event_type"   TEXT           NOT NULL,
  "payload"      JSONB          NOT NULL,
  "status"       "OutboxStatus" NOT NULL DEFAULT 'PENDING',
  "retry_count"  INT            NOT NULL DEFAULT 0,
  "created_at"   TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "processed_at" TIMESTAMPTZ(6),
  CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notification_outbox_status_created_at_idx"
  ON "notification_outbox" ("status", "created_at");

-- 3. courses — performance indexes
CREATE INDEX IF NOT EXISTS "courses_course_seller_id_idx" ON "courses" ("course_seller_id");
CREATE INDEX IF NOT EXISTS "courses_status_idx"           ON "courses" ("status");

-- 4. lessons — test_id column + indexes
ALTER TABLE "lessons"
  ADD COLUMN IF NOT EXISTS "test_id" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "lessons_module_id_lesson_order_key"
  ON "lessons" ("module_id", "lesson_order");

CREATE INDEX IF NOT EXISTS "lessons_test_id_idx" ON "lessons" ("test_id");

-- 5. modules — composite indexes
CREATE UNIQUE INDEX IF NOT EXISTS "modules_course_id_module_order_key"
  ON "modules" ("course_id", "module_order");

CREATE INDEX IF NOT EXISTS "modules_course_id_module_order_idx"
  ON "modules" ("course_id", "module_order");
