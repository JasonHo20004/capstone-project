-- AlterTable: change profile_picture from VARCHAR(255) to TEXT
-- Allows storing base64 data URIs for avatar images
ALTER TABLE "identity_db"."users" ALTER COLUMN "profile_picture" TYPE TEXT;
