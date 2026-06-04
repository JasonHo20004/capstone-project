-- AlterTable: add approval tracking fields to course_seller_applications
-- These columns were added directly to the DB and are now captured in migration history.
ALTER TABLE "identity_db"."course_seller_applications"
  ADD COLUMN IF NOT EXISTS "approved_by" UUID,
  ADD COLUMN IF NOT EXISTS "approved_at" TIMESTAMPTZ(6);
