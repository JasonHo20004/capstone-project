-- Idempotent — safe to re-run if a prior partial apply already added some columns.
-- AlterTable: review workflow metadata on courses
ALTER TABLE "courses"
  ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "approved_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "rejected_at" TIMESTAMPTZ(6),
  ADD COLUMN IF NOT EXISTS "rejection_reason" TEXT,
  ADD COLUMN IF NOT EXISTS "reviewed_by_id" UUID;

-- CreateTable: append-only audit log of every review-workflow transition
CREATE TABLE IF NOT EXISTS "course_review_history" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "course_id" UUID NOT NULL,
  "from_status" "CourseStatus" NOT NULL,
  "to_status" "CourseStatus" NOT NULL,
  "actor_id" UUID NOT NULL,
  "actor_role" VARCHAR(20) NOT NULL,
  "reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "course_review_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "course_review_history_course_id_created_at_idx"
  ON "course_review_history"("course_id", "created_at");

-- FK is added separately because there's no "ADD CONSTRAINT IF NOT EXISTS" in
-- vanilla Postgres — wrap in DO block to skip when already attached.
DO $$ BEGIN
  ALTER TABLE "course_review_history"
    ADD CONSTRAINT "course_review_history_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
