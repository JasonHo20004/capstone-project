-- Drift fix: the previous drift_baseline created placement_questions and
-- tutor_sessions with `updated_at ... DEFAULT now()`. Prisma's @updatedAt
-- columns must NOT have a DB-level default (Prisma sets the value at the
-- application layer). The actual database never had these defaults, so drop
-- them from the shadow-DB state to remove the drift.
-- Both ALTER statements are no-ops if no default exists (safe to re-run).

ALTER TABLE "placement_questions" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "tutor_sessions"      ALTER COLUMN "updated_at" DROP DEFAULT;
