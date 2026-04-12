/*
  Warnings:

  - The values [MOMO] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- First update any remaining MOMO values to STRIPE
UPDATE "topup_orders" SET "payment_method" = 'STRIPE' WHERE "payment_method" = 'MOMO';

-- AlterEnum
CREATE TYPE "PaymentMethod_new" AS ENUM ('STRIPE', 'ZALOPAY', 'BANKING', 'APPLEPAY');
ALTER TABLE "topup_orders" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
