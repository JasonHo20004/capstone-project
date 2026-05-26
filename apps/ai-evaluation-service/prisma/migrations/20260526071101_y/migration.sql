/*
  Warnings:

  - You are about to drop the column `embedding` on the `ielts_knowledge_base` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "advisor_log_time_idx";

-- DropIndex
DROP INDEX "ielts_kb_embedding_idx";

-- AlterTable
ALTER TABLE "advisor_action_log" ALTER COLUMN "payload" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ielts_knowledge_base" DROP COLUMN "embedding";

-- AlterTable
ALTER TABLE "user_learning_profiles" ALTER COLUMN "advisor_config" SET DEFAULT '{}',
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "advisor_action_log_created_at_idx" ON "advisor_action_log"("created_at");

-- RenameIndex
ALTER INDEX "advisor_log_type_idx" RENAME TO "advisor_action_log_action_type_idx";

-- RenameIndex
ALTER INDEX "advisor_log_user_idx" RENAME TO "advisor_action_log_user_id_idx";

-- RenameIndex
ALTER INDEX "ielts_kb_band_idx" RENAME TO "ielts_knowledge_base_band_range_idx";

-- RenameIndex
ALTER INDEX "ielts_kb_skill_idx" RENAME TO "ielts_knowledge_base_skill_idx";
