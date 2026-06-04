// =============================================================================
// AI Evaluation Service - Speaking Evaluation Worker (Gemini Multimodal)
// =============================================================================

import { Worker, Job } from "bullmq";
import { SpeakingJobData, SpeakingEvaluationResult } from "../types.js";
import { getBullMQConnection } from "../redis-connection.js";
import { geminiClient } from "../../llm/gemini.client.js";
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

        // Step 2: Send audio directly to Gemini for transcript + evaluation
        console.log(`🤖 [Worker] Sending audio to Gemini for ${evaluationId}...`);
        const response = await geminiClient.multimodalCompletion(
          SPEAKING_EVALUATION_PROMPT,
          audioBase64,
          mimeType,
          "Please listen to this IELTS Speaking response and evaluate it. Provide transcript, detailed analysis, and precise scores.",
          { temperature: 0.2, useProModel: false } // Flash model for cost/rate-limit efficiency
        );

        const result: SpeakingEvaluationResult & { transcript?: string } = JSON.parse(response);

        // Save result to DB
        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: {
            transcript: result.transcript || "",
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
