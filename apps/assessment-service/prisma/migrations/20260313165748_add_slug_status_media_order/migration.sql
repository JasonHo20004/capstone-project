/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "media_url" TEXT,
ADD COLUMN     "order_index" INTEGER;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "slug" VARCHAR(300),
ADD COLUMN     "status" VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "tests_slug_key" ON "tests"("slug");
