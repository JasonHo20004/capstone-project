-- Per-segment Whisper timestamps for listening sections, enabling transcript↔audio
-- sync (click a transcript line → seek the audio) in the post-submit review.
-- Additive, nullable column — safe on existing rows.
ALTER TABLE "sections" ADD COLUMN "audio_segments" JSONB;
