-- AlterTable: Add topic and level columns to user_skill_trees
ALTER TABLE "ai_evaluation_db"."user_skill_trees" ADD COLUMN "topic" VARCHAR(50) NOT NULL DEFAULT 'general';
ALTER TABLE "ai_evaluation_db"."user_skill_trees" ADD COLUMN "level" VARCHAR(10) NOT NULL DEFAULT 'B1';

-- DropIndex: Remove old unique constraint on user_id only
DROP INDEX IF EXISTS "ai_evaluation_db"."user_skill_trees_user_id_key";

-- CreateIndex: New composite unique constraint on (user_id, topic, level)
CREATE UNIQUE INDEX "user_skill_trees_user_id_topic_level_key" ON "ai_evaluation_db"."user_skill_trees"("user_id", "topic", "level");

-- CreateEnum
CREATE TYPE "ai_evaluation_db"."MiniQuizStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "ai_evaluation_db"."mini_quizzes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "skill_tree_id" UUID NOT NULL,
    "node_id" VARCHAR(100) NOT NULL,
    "questions" JSONB NOT NULL,
    "user_answers" JSONB,
    "score" DOUBLE PRECISION,
    "total_questions" INTEGER NOT NULL,
    "status" "ai_evaluation_db"."MiniQuizStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "mini_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mini_quizzes_user_id_idx" ON "ai_evaluation_db"."mini_quizzes"("user_id");

-- CreateIndex
CREATE INDEX "mini_quizzes_skill_tree_id_node_id_idx" ON "ai_evaluation_db"."mini_quizzes"("skill_tree_id", "node_id");
