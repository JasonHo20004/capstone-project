-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'GAP_FILL';
ALTER TYPE "QuestionType" ADD VALUE 'MATCHING';
ALTER TYPE "QuestionType" ADD VALUE 'TRUE_FALSE_NOT_GIVEN';
ALTER TYPE "QuestionType" ADD VALUE 'TOEIC_SINGLE_CHOICE';
ALTER TYPE "QuestionType" ADD VALUE 'TOEIC_TEXT_COMPLETION';
ALTER TYPE "QuestionType" ADD VALUE 'IELTS_WRITING_TASK1';
ALTER TYPE "QuestionType" ADD VALUE 'IELTS_WRITING_TASK2';
ALTER TYPE "QuestionType" ADD VALUE 'IELTS_SPEAKING';
ALTER TYPE "QuestionType" ADD VALUE 'TOEIC_WRITING';
ALTER TYPE "QuestionType" ADD VALUE 'TOEIC_SPEAKING';

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "answer" JSONB,
ADD COLUMN     "content" JSONB,
ADD COLUMN     "explanation" TEXT;
