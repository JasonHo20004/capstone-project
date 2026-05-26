/*
  Warnings:

  - The values [MONTHLYFEE] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- DataMigration: reclassify legacy MONTHLYFEE rows as SUBSCRIPTION before
-- the enum value is removed. Must run outside the ALTER TYPE transaction.
UPDATE "transactions"
SET "transaction_type" = 'SUBSCRIPTION'
WHERE "transaction_type" = 'MONTHLYFEE';

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('DEPOSIT', 'PAYMENT', 'WITHDRAW', 'SUBSCRIPTION', 'COMMISSION', 'SELLER_EARNING');
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" TYPE "TransactionType_new" USING ("transaction_type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "payment_db"."TransactionType_old";
COMMIT;
