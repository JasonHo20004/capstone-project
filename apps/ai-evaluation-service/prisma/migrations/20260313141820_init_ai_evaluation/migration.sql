-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "writing_evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "session_id" UUID,
    "question_id" UUID,
    "essay_text" TEXT NOT NULL,
    "overall_band" DOUBLE PRECISION,
    "criteria" JSONB,
    "highlighted_errors" JSONB,
    "overall_feedback" TEXT,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "job_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "writing_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "session_id" UUID,
    "question_id" UUID,
    "audio_url" TEXT NOT NULL,
    "transcript" TEXT,
    "duration" DOUBLE PRECISION,
    "overall_band" DOUBLE PRECISION,
    "pronunciation_score" DOUBLE PRECISION,
    "fluency_score" DOUBLE PRECISION,
    "vocab_score" DOUBLE PRECISION,
    "grammar_score" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "job_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "speaking_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skill_trees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_skill_trees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learning_goals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "current_level" VARCHAR(20),
    "target_score" VARCHAR(50),
    "deadline" VARCHAR(50),
    "roadmap" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "writing_evaluations_job_id_key" ON "writing_evaluations"("job_id");

-- CreateIndex
CREATE INDEX "writing_evaluations_user_id_idx" ON "writing_evaluations"("user_id");

-- CreateIndex
CREATE INDEX "writing_evaluations_status_idx" ON "writing_evaluations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_evaluations_job_id_key" ON "speaking_evaluations"("job_id");

-- CreateIndex
CREATE INDEX "speaking_evaluations_user_id_idx" ON "speaking_evaluations"("user_id");

-- CreateIndex
CREATE INDEX "speaking_evaluations_status_idx" ON "speaking_evaluations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_trees_user_id_key" ON "user_skill_trees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_goals_user_id_key" ON "user_learning_goals"("user_id");
