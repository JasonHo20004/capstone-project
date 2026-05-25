-- CreateTable
CREATE TABLE "placement_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section" INTEGER NOT NULL,
    "difficulty" VARCHAR(10) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "skill_tag" VARCHAR(100),
    "context" TEXT,
    "instruction" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "option_a" TEXT,
    "option_b" TEXT,
    "option_c" TEXT,
    "correct_answer" VARCHAR(1),
    "passage" TEXT,
    "fixed_fragment" TEXT,
    "fragment_a" TEXT,
    "fragment_b" TEXT,
    "fragment_c" TEXT,
    "correct_order" VARCHAR(5),
    "audio_context" TEXT,
    "audio_script" TEXT,
    "audio_url" TEXT,
    "time_limit" INTEGER NOT NULL DEFAULT 30,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "placement_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    "question_ids" UUID[],
    "raw_score" INTEGER,
    "max_score" INTEGER,
    "percentage" DECIMAL(5,2),
    "cefr_level" VARCHAR(10),
    "section_scores" JSONB,
    "last_question_index" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "question_index" INTEGER NOT NULL,
    "selected_option" VARCHAR(1),
    "selected_order" VARCHAR(5),
    "is_correct" BOOLEAN,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "time_spent" INTEGER,
    "answered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_pq_section_difficulty_active" ON "placement_questions"("section", "difficulty", "is_active");

-- CreateIndex
CREATE INDEX "idx_pq_type" ON "placement_questions"("type");

-- CreateIndex
CREATE INDEX "idx_ps_user_status" ON "placement_sessions"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_pa_session" ON "placement_answers"("session_id");

-- AddForeignKey
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "placement_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "placement_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
