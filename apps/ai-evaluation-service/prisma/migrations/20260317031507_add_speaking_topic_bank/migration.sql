-- AlterTable
ALTER TABLE "speaking_sessions" ADD COLUMN     "topic_id" UUID;

-- CreateTable
CREATE TABLE "speaking_topics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "part1_questions" JSONB NOT NULL DEFAULT '[]',
    "part2_topic" TEXT,
    "part2_bullets" JSONB NOT NULL DEFAULT '[]',
    "part2_final_prompt" TEXT,
    "part3_questions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "speaking_topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "speaking_sessions" ADD CONSTRAINT "speaking_sessions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "speaking_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
