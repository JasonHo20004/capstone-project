// =============================================================================
// TTS Service - Text-to-Speech Integration
// Calls HuggingFace-hosted TTS service to generate audio for flashcard words
// =============================================================================

const TTS_BASE_URL =
  process.env.TTS_FILE_BASE_URL || "https://minhduy1912-tss-service.hf.space";

interface TTSResponse {
  audio_url?: string;
  url?: string;
  file_url?: string;
  error?: string;
}

/**
 * Generate TTS audio for a given English text.
 * Returns the S3-hosted audio URL, or null on failure.
 */
export async function generateTTSAudio(
  text: string,
  voiceId: string = "af_bella",
  speed: number = 1.0
): Promise<string | null> {
  try {
    const response = await fetch(`${TTS_BASE_URL}/generate-tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: voiceId, speed }),
    });

    if (!response.ok) {
      console.warn(`[TTS] Failed: ${response.status} for "${text}"`);
      return null;
    }

    const data: TTSResponse = await response.json();
    // The TTS service may return the URL under different keys
    const audioUrl = data.audio_url || data.url || data.file_url || null;

    if (audioUrl) {
      console.log(`[TTS] ✅ Generated audio for "${text}": ${audioUrl}`);
    }

    return audioUrl;
  } catch (error: any) {
    console.warn(`[TTS] Error generating audio for "${text}": ${error.message}`);
    return null;
  }
}
