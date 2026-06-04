-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'ESSAY', 'FILL_IN_THE_BLANK');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('READING', 'LISTENING', 'WRITING', 'SPEAKING');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('FINAL');

-- CreateTable
CREATE TABLE "english_test_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "english_test_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "duration_in_minutes" INTEGER,
    "total_score" DOUBLE PRECISION,
    "passing_score" DOUBLE PRECISION,
    "english_test_type_id" UUID NOT NULL,
    "practice_count" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "max_attempts" INTEGER,
    "test_type" "TestType",
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tests" (
    "course_id" UUID NOT NULL,
    "test_id" UUID NOT NULL,

    CONSTRAINT "course_tests_pkey" PRIMARY KEY ("course_id","test_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "test_id" UUID,
    "skill" "SkillType",
    "duration_in_seconds" DOUBLE PRECISION,
    "total_questions" INTEGER,
    "total_score" DOUBLE PRECISION,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "passage_order" INTEGER,

    CONSTRAINT "passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section_id" UUID,
    "question_text" TEXT,
    "image_url" TEXT,
    "question_type" "QuestionType" NOT NULL,
    "options" TEXT[],
    "correct_answer_index" INTEGER,
    "word_limit" INTEGER,
    "correct_answer" TEXT,
    "passage_id" UUID,
    "question_order" INTEGER,
    "test_id" UUID,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "test_id" UUID NOT NULL,
    "selected_sections" TEXT[],
    "status" "SessionStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "overall_scaled_score" DOUBLE PRECISION,
    "raw_scores_by_skill" JSONB,
    "scores_by_skill" JSONB,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "practice_session_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "answer_text" TEXT,
    "selected_option_index" INTEGER,
    "is_correct" BOOLEAN,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_conversions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "english_test_type_id" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "raw_score" INTEGER NOT NULL,
    "scaled_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "score_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_skills" (
    "test_id" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,

    CONSTRAINT "test_skills_pkey" PRIMARY KEY ("test_id","skill")
);

-- CreateIndex
CREATE UNIQUE INDEX "passages_section_id_passage_order_key" ON "passages"("section_id", "passage_order");

-- CreateIndex
CREATE UNIQUE INDEX "user_answers_practice_session_id_question_id_user_id_key" ON "user_answers"("practice_session_id", "question_id", "user_id");

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_english_test_type_id_fkey" FOREIGN KEY ("english_test_type_id") REFERENCES "english_test_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tests" ADD CONSTRAINT "course_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passages" ADD CONSTRAINT "passages_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "passages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_practice_session_id_fkey" FOREIGN KEY ("practice_session_id") REFERENCES "practice_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_conversions" ADD CONSTRAINT "score_conversions_english_test_type_id_fkey" FOREIGN KEY ("english_test_type_id") REFERENCES "english_test_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_skills" ADD CONSTRAINT "test_skills_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
