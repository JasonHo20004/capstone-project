-- CreateEnum
CREATE TYPE "FlashcardStatus" AS ENUM ('LEARNING', 'REVIEW');

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_decks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "user_id" UUID NOT NULL,

    CONSTRAINT "flashcard_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "front_content" TEXT NOT NULL,
    "back_content" TEXT NOT NULL,
    "example_sentence" TEXT,
    "audio_url" TEXT,
    "deck_id" UUID NOT NULL,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_tags" (
    "tag_id" UUID NOT NULL,
    "deck_id" UUID NOT NULL,

    CONSTRAINT "deck_tags_pkey" PRIMARY KEY ("tag_id","deck_id")
);

-- CreateTable
CREATE TABLE "user_flashcard_progress" (
    "user_id" UUID NOT NULL,
    "flash_card_id" UUID NOT NULL,
    "status" "FlashcardStatus" NOT NULL DEFAULT 'LEARNING',
    "next_review_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "learning_step" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_flashcard_progress_pkey" PRIMARY KEY ("user_id","flash_card_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_tags" ADD CONSTRAINT "deck_tags_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_tags" ADD CONSTRAINT "deck_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_flash_card_id_fkey" FOREIGN KEY ("flash_card_id") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
