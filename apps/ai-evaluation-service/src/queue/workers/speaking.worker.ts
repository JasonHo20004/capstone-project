// =============================================================================
// AI Evaluation Service - Speaking Evaluation Worker (Gemini Multimodal)
// =============================================================================

import { Worker, Job } from "bullmq";
import { SpeakingJobData, SpeakingEvaluationResult } from "../types.js";
import { getBullMQConnection } from "../redis-connection.js";
import { geminiClient, extractJson } from "../../llm/gemini.client.js";
import { llmClient } from "../../llm/llm.client.js";
import { SPEAKING_EVALUATION_PROMPT } from "../../llm/prompts.js";
import { databaseService } from "../../services/database.service.js";

const QUEUE_NAME = "ai-evaluation-queue";

export function createSpeakingWorker(): Worker {
  const connection = getBullMQConnection();

  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<SpeakingJobData>) => {
      if (job.name !== "GRADE_SPEAKING") return;

      const { evaluationId, audioUrl, userId } = job.data;
      console.log(`🎙️ [Worker] Processing speaking evaluation ${evaluationId} for user ${userId}`);

      const prisma = databaseService.getClient();

      try {
        // Update status to PROCESSING
        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: { status: "PROCESSING" },
        });

        // Step 1: Download audio from URL
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
          throw new Error(`Failed to download audio: ${audioResponse.statusText}`);
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");

        // Detect MIME type from URL or default to webm
        const mimeType = audioUrl.endsWith(".mp3")
          ? "audio/mp3"
          : audioUrl.endsWith(".wav")
          ? "audio/wav"
          : "audio/webm";

        // Step 2: Transcribe with Groq Whisper first — it is more accurate on
        // non-native accents than Gemini's own ASR, so it gives a reliable
        // ground-truth of WHAT was said (drives Lexical/Grammar scoring).
        let whisperTranscript = "";
        try {
          const audioBlob = new Blob([Buffer.from(audioBuffer) as any], { type: mimeType });
          const stt = await llmClient.transcribeAudio(audioBlob, "audio.webm");
          whisperTranscript = (stt.transcript || "").trim();
          console.log(`🎧 [Worker] Whisper STT (${stt.duration}s, ${whisperTranscript.length} chars) for ${evaluationId}`);
        } catch (sttErr: any) {
          // Non-fatal: fall back to letting Gemini transcribe from the audio itself.
          console.warn(`⚠️ [Worker] Whisper STT failed for ${evaluationId}, Gemini will transcribe:`, sttErr?.message || sttErr);
        }

        // Step 3: Send the audio to Gemini so it can HEAR pronunciation & fluency,
        // with the Whisper transcript as the ground truth for what was said.
        // useProModel: true → grade on Pro first (whole key pool), Flash only if
        // the entire pool is exhausted on Pro (handled inside gemini.client).
        console.log(`🤖 [Worker] Sending audio to Gemini [Pro] for ${evaluationId}...`);
        const textPrompt = whisperTranscript
          ? `Please evaluate this IELTS Speaking response.\n\n` +
            `An accurate transcript (Whisper STT) of what the candidate said is provided below — ` +
            `treat it as the GROUND TRUTH for the words spoken (Lexical Resource & Grammar). ` +
            `Listen to the audio yourself to judge Pronunciation and Fluency (intonation, pace, hesitation). ` +
            `Return this transcript in the "transcript" field.\n\n` +
            `--- TRANSCRIPT ---\n${whisperTranscript}\n--- END TRANSCRIPT ---`
          : "Please listen to this IELTS Speaking response and evaluate it. Provide transcript, detailed analysis, and precise scores.";

        const response = await geminiClient.multimodalCompletion(
          SPEAKING_EVALUATION_PROMPT,
          audioBase64,
          mimeType,
          textPrompt,
          { temperature: 0.2, useProModel: true, maxTokens: 8192 }
        );

        const result: SpeakingEvaluationResult & { transcript?: string } = extractJson(response);

        // Save result to DB
        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: {
            transcript: whisperTranscript || result.transcript || "",
            overallBand: result.overall_band,
            pronunciationScore: result.pronunciation_score,
            fluencyScore: result.fluency_score,
            vocabScore: result.vocab_score,
            grammarScore: result.grammar_score,
            feedback: result.feedback,
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // Notify user
        try {
          const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006";
          await fetch(`${notificationUrl}/api/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              title: "Speaking Assessment Complete",
              message: `Your IELTS Speaking assessment has been graded. You scored Band ${result.overall_band}.`,
              type: "AI_GRADING",
              metadata: { evaluationId, overallBand: result.overall_band },
            }),
          });
        } catch (notifyErr) {
          console.warn("⚠️ [Worker] Failed to send notification:", notifyErr);
        }

        console.log(`✅ [Worker] Speaking evaluation ${evaluationId} completed — Band ${result.overall_band}`);
        return result;
      } catch (error) {
        console.error(`❌ [Worker] Speaking evaluation ${evaluationId} failed:`, error);

        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: { status: "FAILED" },
        });

        throw error; // BullMQ will retry
      }
    },
    {
      connection,
      concurrency: 1, // Speaking is heavier (audio processing), process 1 at a time
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ [Worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ [Worker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
