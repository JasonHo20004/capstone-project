-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('IELTS', 'TOEFL', 'TOEIC');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'GAP_FILL', 'MATCHING', 'TRUE_FALSE_NOT_GIVEN');

-- CreateTable
CREATE TABLE "practice_tests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "exam_type" "ExamType" NOT NULL DEFAULT 'IELTS',
    "status" VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "practice_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "practice_test_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "exam_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_parts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exam_section_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "media_url" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "exam_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exam_part_id" UUID NOT NULL,
    "instructions" TEXT,
    "image_urls" TEXT[],
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "question_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question_group_id" UUID NOT NULL,
    "type" "QuestionType" NOT NULL,
    "content" JSONB NOT NULL,
    "answer" JSONB NOT NULL,
    "explanation" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_sections" ADD CONSTRAINT "exam_sections_practice_test_id_fkey" FOREIGN KEY ("practice_test_id") REFERENCES "practice_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_parts" ADD CONSTRAINT "exam_parts_exam_section_id_fkey" FOREIGN KEY ("exam_section_id") REFERENCES "exam_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_groups" ADD CONSTRAINT "question_groups_exam_part_id_fkey" FOREIGN KEY ("exam_part_id") REFERENCES "exam_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_question_group_id_fkey" FOREIGN KEY ("question_group_id") REFERENCES "question_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
