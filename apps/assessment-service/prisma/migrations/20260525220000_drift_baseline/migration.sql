-- =============================================================================
-- Assessment-service drift baseline — idempotent, safe to re-run.
-- Captures all DB changes made outside migration history.
-- =============================================================================

-- 1. QuestionType enum — add missing variants
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE IF NOT EXISTS 'MULTIPLE_CHOICE_MULTI_ANSWER'; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE IF NOT EXISTS 'SHORT_ANSWER';                 EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TYPE "QuestionType" ADD VALUE IF NOT EXISTS 'YES_NO_NOT_GIVEN';             EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. tests — seller_id column + index
ALTER TABLE "tests" ADD COLUMN IF NOT EXISTS "seller_id" UUID;
CREATE INDEX IF NOT EXISTS "tests_seller_id_idx" ON "tests" ("seller_id");

-- 3. sections — audio_transcript column
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "audio_transcript" TEXT;

-- 4. user_answers — new columns
ALTER TABLE "user_answers"
  ADD COLUMN IF NOT EXISTS "question_snapshot" JSONB,
  ADD COLUMN IF NOT EXISTS "score_at_submit"   FLOAT;

-- 5. DictationStatus enum
DO $$ BEGIN
  CREATE TYPE "DictationStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 6. dictation_exercises
CREATE TABLE IF NOT EXISTS "dictation_exercises" (
  "id"              UUID           NOT NULL DEFAULT gen_random_uuid(),
  "title"           VARCHAR(255)   NOT NULL,
  "description"     VARCHAR(500),
  "audio_url"       TEXT           NOT NULL,
  "level"           VARCHAR(20),
  "category"        VARCHAR(100),
  "total_sentences" INT            NOT NULL,
  "is_published"    BOOLEAN        NOT NULL DEFAULT false,
  "is_premium"      BOOLEAN        NOT NULL DEFAULT false,
  "created_at"      TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "dictation_exercises_pkey" PRIMARY KEY ("id")
);

-- 7. dictation_sentences
CREATE TABLE IF NOT EXISTS "dictation_sentences" (
  "id"          UUID  NOT NULL DEFAULT gen_random_uuid(),
  "exercise_id" UUID  NOT NULL,
  "index"       INT   NOT NULL,
  "text"        TEXT  NOT NULL,
  "start_time"  FLOAT NOT NULL,
  "end_time"    FLOAT NOT NULL,
  CONSTRAINT "dictation_sentences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "dictation_sentences_exercise_id_index_key" ON "dictation_sentences" ("exercise_id", "index");
DO $$ BEGIN
  ALTER TABLE "dictation_sentences" ADD CONSTRAINT "dictation_sentences_exercise_id_fkey"
    FOREIGN KEY ("exercise_id") REFERENCES "dictation_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 8. dictation_sessions
CREATE TABLE IF NOT EXISTS "dictation_sessions" (
  "id"              UUID              NOT NULL DEFAULT gen_random_uuid(),
  "user_id"         UUID              NOT NULL,
  "exercise_id"     UUID              NOT NULL,
  "current_index"   INT               NOT NULL DEFAULT 0,
  "completed_count" INT               NOT NULL DEFAULT 0,
  "accuracy"        FLOAT,
  "status"          "DictationStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "created_at"      TIMESTAMPTZ(6)    NOT NULL DEFAULT now(),
  "completed_at"    TIMESTAMPTZ(6),
  CONSTRAINT "dictation_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "dictation_sessions_user_id_idx" ON "dictation_sessions" ("user_id");
DO $$ BEGIN
  ALTER TABLE "dictation_sessions" ADD CONSTRAINT "dictation_sessions_exercise_id_fkey"
    FOREIGN KEY ("exercise_id") REFERENCES "dictation_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 9. test_comments
CREATE TABLE IF NOT EXISTS "test_comments" (
  "id"                UUID           NOT NULL DEFAULT gen_random_uuid(),
  "test_id"           UUID           NOT NULL,
  "user_id"           UUID           NOT NULL,
  "content"           TEXT           NOT NULL,
  "parent_comment_id" UUID,
  "created_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "test_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "test_comments_test_id_idx" ON "test_comments" ("test_id");
DO $$ BEGIN
  ALTER TABLE "test_comments" ADD CONSTRAINT "test_comments_test_id_fkey"
    FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  ALTER TABLE "test_comments" ADD CONSTRAINT "test_comments_parent_comment_id_fkey"
    FOREIGN KEY ("parent_comment_id") REFERENCES "test_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 10. tutor_sessions
CREATE TABLE IF NOT EXISTS "tutor_sessions" (
  "id"                  UUID           NOT NULL DEFAULT gen_random_uuid(),
  "practice_session_id" UUID           NOT NULL,
  "question_id"         UUID           NOT NULL,
  "user_id"             UUID           NOT NULL,
  "created_at"          TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "updated_at"          TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "tutor_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "tutor_sessions_practice_session_id_question_id_user_id_key"
  ON "tutor_sessions" ("practice_session_id", "question_id", "user_id");
CREATE INDEX IF NOT EXISTS "tutor_sessions_user_id_idx" ON "tutor_sessions" ("user_id");

-- 11. tutor_messages
CREATE TABLE IF NOT EXISTS "tutor_messages" (
  "id"               UUID           NOT NULL DEFAULT gen_random_uuid(),
  "tutor_session_id" UUID           NOT NULL,
  "role"             VARCHAR(20)    NOT NULL,
  "content"          TEXT           NOT NULL,
  "created_at"       TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "tutor_messages_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "tutor_messages_tutor_session_id_idx" ON "tutor_messages" ("tutor_session_id");
DO $$ BEGIN
  ALTER TABLE "tutor_messages" ADD CONSTRAINT "tutor_messages_tutor_session_id_fkey"
    FOREIGN KEY ("tutor_session_id") REFERENCES "tutor_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 12. placement_questions
CREATE TABLE IF NOT EXISTS "placement_questions" (
  "id"              UUID           NOT NULL DEFAULT gen_random_uuid(),
  "section"         INT            NOT NULL,
  "difficulty"      VARCHAR(10)    NOT NULL,
  "type"            VARCHAR(20)    NOT NULL,
  "skill_tag"       VARCHAR(100),
  "context"         TEXT,
  "instruction"     TEXT           NOT NULL,
  "prompt"          TEXT           NOT NULL,
  "option_a"        TEXT,
  "option_b"        TEXT,
  "option_c"        TEXT,
  "correct_answer"  VARCHAR(1),
  "passage"         TEXT,
  "fixed_fragment"  TEXT,
  "fragment_a"      TEXT,
  "fragment_b"      TEXT,
  "fragment_c"      TEXT,
  "correct_order"   VARCHAR(5),
  "audio_context"   TEXT,
  "audio_script"    TEXT,
  "audio_url"       TEXT,
  "time_limit"      INT            NOT NULL DEFAULT 30,
  "is_active"       BOOLEAN        NOT NULL DEFAULT true,
  "created_at"      TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "updated_at"      TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "placement_questions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_pq_section_difficulty_active" ON "placement_questions" ("section", "difficulty", "is_active");
CREATE INDEX IF NOT EXISTS "idx_pq_type" ON "placement_questions" ("type");

-- 13. placement_sessions
CREATE TABLE IF NOT EXISTS "placement_sessions" (
  "id"                  UUID           NOT NULL DEFAULT gen_random_uuid(),
  "user_id"             UUID           NOT NULL,
  "status"              VARCHAR(20)    NOT NULL DEFAULT 'in_progress',
  "question_ids"        UUID[]         NOT NULL,
  "raw_score"           INT,
  "max_score"           INT,
  "percentage"          DECIMAL(5,2),
  "cefr_level"          VARCHAR(10),
  "section_scores"      JSONB,
  "last_question_index" INT            NOT NULL DEFAULT 0,
  "started_at"          TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "completed_at"        TIMESTAMPTZ(6),
  "created_at"          TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "placement_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_ps_user_status" ON "placement_sessions" ("user_id", "status");

-- 14. placement_answers
CREATE TABLE IF NOT EXISTS "placement_answers" (
  "id"              UUID           NOT NULL DEFAULT gen_random_uuid(),
  "session_id"      UUID           NOT NULL,
  "question_id"     UUID           NOT NULL,
  "question_index"  INT            NOT NULL,
  "selected_option" VARCHAR(1),
  "selected_order"  VARCHAR(5),
  "is_correct"      BOOLEAN,
  "points_earned"   INT            NOT NULL DEFAULT 0,
  "time_spent"      INT,
  "answered_at"     TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  CONSTRAINT "placement_answers_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "idx_pa_session" ON "placement_answers" ("session_id");
DO $$ BEGIN
  ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_session_id_fkey"
    FOREIGN KEY ("session_id") REFERENCES "placement_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_question_id_fkey"
    FOREIGN KEY ("question_id") REFERENCES "placement_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
