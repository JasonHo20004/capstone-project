-- Restore the pgvector `embedding` column on ielts_knowledge_base.
--
-- Migration 20260526071101_y dropped this column (it was Prisma "drift" because
-- the column lived only in raw SQL, not in schema.prisma). That broke RAG
-- retrieval with: `column "embedding" does not exist` (Postgres 42703).
--
-- The schema now maps the column as Unsupported("vector(768)") so Prisma will not
-- drop it again. This migration re-adds the column + cosine index. All statements
-- are idempotent so it is safe to run against a DB where the column was never
-- dropped. Existing rows get a NULL embedding and must be back-filled (the DROP
-- discarded the vectors but kept `content`) — run the kb backfill tool afterward.

-- Ensure the extension exists (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Re-add the embedding column. The `vector` type lives in the `public` schema
-- (Supabase default), but this connection's search_path is `ai_evaluation_db`
-- only — so every pgvector type/opclass MUST be schema-qualified, otherwise
-- Postgres raises 42704 "type vector does not exist".
ALTER TABLE "ai_evaluation_db"."ielts_knowledge_base"
    ADD COLUMN IF NOT EXISTS "embedding" public.vector(768);

-- Re-create the ivfflat cosine-similarity index used by RagService.retrieve()
CREATE INDEX IF NOT EXISTS "ielts_kb_embedding_idx"
    ON "ai_evaluation_db"."ielts_knowledge_base"
    USING ivfflat (embedding public.vector_cosine_ops)
    WITH (lists = 100);
