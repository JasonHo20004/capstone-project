-- Add in-progress draft answer storage to practice sessions.
-- Additive, nullable columns — safe to apply to existing rows.
ALTER TABLE "practice_sessions"
  ADD COLUMN "draft_answers" JSONB,
  ADD COLUMN "draft_saved_at" TIMESTAMPTZ(6);
