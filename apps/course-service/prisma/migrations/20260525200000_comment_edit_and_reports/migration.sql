-- Add edit + moderation columns to comments
ALTER TABLE "comments"
  ADD COLUMN IF NOT EXISTS "edited_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "edit_history" JSONB,
  ADD COLUMN IF NOT EXISTS "hidden_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "hidden_reason" TEXT;

CREATE INDEX IF NOT EXISTS "comments_hidden_at_idx" ON "comments" ("hidden_at");

-- Enums for comment reports
DO $$ BEGIN
  CREATE TYPE "CommentReportReason" AS ENUM ('SPAM', 'ABUSE', 'SCAM', 'MISINFORMATION', 'OFF_TOPIC', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "CommentReportStatus" AS ENUM ('PENDING', 'RESOLVED_REMOVED', 'RESOLVED_KEPT', 'DISMISSED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CommentReport table
CREATE TABLE IF NOT EXISTS "comment_reports" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "comment_id" UUID NOT NULL,
  "reporter_id" UUID NOT NULL,
  "reason_type" "CommentReportReason" NOT NULL,
  "note" TEXT,
  "status" "CommentReportStatus" NOT NULL DEFAULT 'PENDING',
  "resolved_by_id" UUID,
  "resolved_at" TIMESTAMPTZ(6),
  "resolution_note" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "comment_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "comment_reports_comment_id_reporter_id_key"
  ON "comment_reports" ("comment_id", "reporter_id");

CREATE INDEX IF NOT EXISTS "comment_reports_status_created_at_idx"
  ON "comment_reports" ("status", "created_at");

ALTER TABLE "comment_reports"
  ADD CONSTRAINT "comment_reports_comment_id_fkey"
  FOREIGN KEY ("comment_id") REFERENCES "comments"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
