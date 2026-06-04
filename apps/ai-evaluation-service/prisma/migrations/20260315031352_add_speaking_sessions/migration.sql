-- CreateEnum
CREATE TYPE "SpeakingSessionStatus" AS ENUM ('IN_PROGRESS', 'GRADING', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "speaking_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "current_part" INTEGER NOT NULL DEFAULT 1,
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "status" "SpeakingSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "topic" TEXT,
    "cue_card" JSONB,
    "turns" JSONB NOT NULL DEFAULT '[]',
    "overall_band" DOUBLE PRECISION,
    "fluency_score" DOUBLE PRECISION,
    "lexical_score" DOUBLE PRECISION,
    "grammar_score" DOUBLE PRECISION,
    "pronunciation_score" DOUBLE PRECISION,
    "detailed_feedback" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "speaking_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "speaking_sessions_user_id_idx" ON "speaking_sessions"("user_id");

-- CreateIndex
CREATE INDEX "speaking_sessions_status_idx" ON "speaking_sessions"("status");
