-- Baseline migration: captures AI Advisor tables applied via the raw
-- manual_add_ai_advisor_tables.sql file, plus three schema drift fixes.
-- All DDL uses IF NOT EXISTS / DO-EXCEPTION guards so it is idempotent.

-- ── 1. Drop defaults from user_skill_trees.topic / level ─────────────────────
-- Migration 20260319050000 added these columns WITH DEFAULT, but schema.prisma
-- declares them without @default — drop the DB default to remove the drift.
ALTER TABLE "ai_evaluation_db"."user_skill_trees"
    ALTER COLUMN "topic"  DROP DEFAULT,
    ALTER COLUMN "level"  DROP DEFAULT;

-- ── 2. Add speaking_topics.is_premium (was missing from 20260317031507) ───────
ALTER TABLE "speaking_topics"
    ADD COLUMN IF NOT EXISTS "is_premium" BOOLEAN NOT NULL DEFAULT false;

-- ── 3. Enable pgvector extension ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── 4. AdvisorActionType enum ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "ai_evaluation_db"."AdvisorActionType" AS ENUM (
    'SHOW_BANNER',
    'SUGGEST_COURSE',
    'UNLOCK_TIP',
    'SEND_REMINDER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 5. user_learning_profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ai_evaluation_db"."user_learning_profiles" (
    "id"                   UUID           NOT NULL DEFAULT gen_random_uuid(),
    "user_id"              UUID           NOT NULL,
    "band_score_target"    DOUBLE PRECISION NOT NULL DEFAULT 6.5,
    "band_score_current"   DOUBLE PRECISION NOT NULL DEFAULT 0,
    "skill_gaps"           JSONB          NOT NULL DEFAULT '{}',
    "learning_personality" JSONB          NOT NULL DEFAULT '{}',
    "advisor_config"       JSONB          NOT NULL DEFAULT '{"proactive_enabled":true,"min_interval_hours":4}',
    "updated_at"           TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at"           TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_learning_profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_learning_profiles_user_id_key"
    ON "ai_evaluation_db"."user_learning_profiles"("user_id");

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION "ai_evaluation_db".update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ulp_updated_at
    ON "ai_evaluation_db"."user_learning_profiles";
CREATE TRIGGER trg_ulp_updated_at
    BEFORE UPDATE ON "ai_evaluation_db"."user_learning_profiles"
    FOR EACH ROW EXECUTE FUNCTION "ai_evaluation_db".update_updated_at();

-- ── 6. ielts_knowledge_base ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ai_evaluation_db"."ielts_knowledge_base" (
    "id"         UUID           NOT NULL DEFAULT gen_random_uuid(),
    "content"    TEXT           NOT NULL,
    "embedding"  VECTOR(768),
    "skill"      VARCHAR(20)    NOT NULL,
    "band_range" VARCHAR(10)    NOT NULL,
    "source"     VARCHAR(200),
    "metadata"   JSONB          NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ielts_knowledge_base_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ielts_kb_embedding_idx"
    ON "ai_evaluation_db"."ielts_knowledge_base"
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
CREATE INDEX IF NOT EXISTS "ielts_kb_skill_idx"
    ON "ai_evaluation_db"."ielts_knowledge_base"("skill");
CREATE INDEX IF NOT EXISTS "ielts_kb_band_idx"
    ON "ai_evaluation_db"."ielts_knowledge_base"("band_range");

-- ── 7. advisor_action_log ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ai_evaluation_db"."advisor_action_log" (
    "id"              UUID           NOT NULL DEFAULT gen_random_uuid(),
    "user_id"         UUID           NOT NULL,
    "action_type"     "ai_evaluation_db"."AdvisorActionType" NOT NULL,
    "payload"         JSONB          NOT NULL DEFAULT '{}',
    "trigger_reason"  TEXT           NOT NULL,
    "delivered_at"    TIMESTAMPTZ(6),
    "acknowledged_at" TIMESTAMPTZ(6),
    "created_at"      TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "advisor_action_log_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "advisor_log_user_idx"
    ON "ai_evaluation_db"."advisor_action_log"("user_id");
CREATE INDEX IF NOT EXISTS "advisor_log_type_idx"
    ON "ai_evaluation_db"."advisor_action_log"("action_type");
CREATE INDEX IF NOT EXISTS "advisor_log_time_idx"
    ON "ai_evaluation_db"."advisor_action_log"("created_at" DESC);
