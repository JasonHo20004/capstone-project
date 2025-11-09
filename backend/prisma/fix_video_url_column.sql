-- Fix for video_url column issue
-- This script will drop the video_url column if it exists
-- Run this SQL directly in your PostgreSQL database

-- Check if column exists and drop it
DO $$ 
BEGIN
    -- Check if column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'lessons' 
        AND column_name = 'video_url'
    ) THEN
        -- Drop the column
        ALTER TABLE "public"."lessons" DROP COLUMN "video_url";
        RAISE NOTICE '✅ Successfully dropped video_url column from lessons table';
    ELSE
        RAISE NOTICE 'ℹ️ Column video_url does not exist in lessons table (already removed)';
    END IF;
END $$;

-- Verify the column is gone
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
    AND table_name = 'lessons'
ORDER BY ordinal_position;

