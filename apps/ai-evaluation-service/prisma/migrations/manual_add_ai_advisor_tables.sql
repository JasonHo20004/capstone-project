-- =============================================================================
-- AI Advisor — Proactive Learning Ecosystem
-- Apply this in: Supabase SQL Editor → ai_evaluation_db schema
-- =============================================================================

-- Enable pgvector extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── User Learning Profile (AI Memory) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_evaluation_db.user_learning_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE,
  band_score_target   FLOAT NOT NULL DEFAULT 6.5,
  band_score_current  FLOAT NOT NULL DEFAULT 0,
  skill_gaps          JSONB NOT NULL DEFAULT '{}',
  learning_personality JSONB NOT NULL DEFAULT '{}',
  advisor_config      JSONB NOT NULL DEFAULT '{"proactive_enabled":true,"min_interval_hours":4}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── IELTS Knowledge Base (pgvector RAG) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_evaluation_db.ielts_knowledge_base (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT NOT NULL,
  embedding   VECTOR(768),               -- Google text-embedding-004 dimension
  skill       VARCHAR(20) NOT NULL,      -- 'listening' | 'reading' | 'writing' | 'speaking' | 'general'
  band_range  VARCHAR(10) NOT NULL,      -- '4.0-5.0' | '5.0-6.0' | '6.0-7.0' | '7.0-9.0'
  source      VARCHAR(200),
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IVFFlat index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS ielts_kb_embedding_idx
  ON ai_evaluation_db.ielts_knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS ielts_kb_skill_idx ON ai_evaluation_db.ielts_knowledge_base (skill);
CREATE INDEX IF NOT EXISTS ielts_kb_band_idx  ON ai_evaluation_db.ielts_knowledge_base (band_range);

-- ─── Advisor Action Type Enum ──────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE ai_evaluation_db."AdvisorActionType" AS ENUM (
    'SHOW_BANNER',
    'SUGGEST_COURSE',
    'UNLOCK_TIP',
    'SEND_REMINDER'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Advisor Action Log (Action Registry audit trail) ──────────────────────────
CREATE TABLE IF NOT EXISTS ai_evaluation_db.advisor_action_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  action_type     ai_evaluation_db."AdvisorActionType" NOT NULL,
  payload         JSONB NOT NULL DEFAULT '{}',
  trigger_reason  TEXT NOT NULL,
  delivered_at    TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS advisor_log_user_idx   ON ai_evaluation_db.advisor_action_log (user_id);
CREATE INDEX IF NOT EXISTS advisor_log_type_idx   ON ai_evaluation_db.advisor_action_log (action_type);
CREATE INDEX IF NOT EXISTS advisor_log_time_idx   ON ai_evaluation_db.advisor_action_log (created_at DESC);

-- ─── Auto-update updated_at trigger ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ai_evaluation_db.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ulp_updated_at ON ai_evaluation_db.user_learning_profiles;
CREATE TRIGGER trg_ulp_updated_at
  BEFORE UPDATE ON ai_evaluation_db.user_learning_profiles
  FOR EACH ROW EXECUTE FUNCTION ai_evaluation_db.update_updated_at();
