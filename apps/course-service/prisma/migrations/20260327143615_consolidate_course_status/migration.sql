-- Consolidate CourseStatus: remove PUBLISHED (→ ACTIVE) and DELETE (→ INACTIVE)

-- Step 1: Migrate existing data
UPDATE "courses" SET "status" = 'ACTIVE' WHERE "status" = 'PUBLISHED';
UPDATE "courses" SET "status" = 'INACTIVE' WHERE "status" = 'DELETE';

-- Step 2: Swap enum
BEGIN;
CREATE TYPE "CourseStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'REFUSE', 'INACTIVE', 'DRAFT');
ALTER TABLE "courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "courses" ALTER COLUMN "status" TYPE "CourseStatus_new" USING ("status"::text::"CourseStatus_new");
ALTER TYPE "CourseStatus" RENAME TO "CourseStatus_old";
ALTER TYPE "CourseStatus_new" RENAME TO "CourseStatus";
DROP TYPE "CourseStatus_old";
ALTER TABLE "courses" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
