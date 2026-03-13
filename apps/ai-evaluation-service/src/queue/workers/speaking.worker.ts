// =============================================================================
// AI Evaluation Service - Speaking Evaluation Worker
// =============================================================================

import { Worker, Job } from "bullmq";
import { SpeakingJobData, SpeakingEvaluationResult } from "../types.js";
import { llmClient } from "../../llm/llm.client.js";
import { SPEAKING_EVALUATION_PROMPT } from "../../llm/prompts.js";
import { databaseService } from "../../services/database.service.js";

const QUEUE_NAME = "ai-evaluation-queue";

export function createSpeakingWorker(): Worker {
  const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  };

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

        // Step 1: Download audio from S3 URL
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
          throw new Error(`Failed to download audio: ${audioResponse.statusText}`);
        }

        const audioBlob = await audioResponse.blob();
        const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });

        // Step 2: Transcribe audio using Groq Whisper
        console.log(`🔊 [Worker] Transcribing audio for ${evaluationId}...`);
        const { transcript, duration } = await llmClient.transcribeAudio(audioFile, "audio.webm");

        // Save transcript to DB
        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: { transcript, duration },
        });

        // Step 3: Evaluate transcript using LLM
        console.log(`🤖 [Worker] Evaluating transcript for ${evaluationId}...`);
        const response = await llmClient.chatCompletion(
          SPEAKING_EVALUATION_PROMPT,
          `Please evaluate the following IELTS Speaking response transcript:\n\n${transcript}`,
          { jsonMode: true, temperature: 0.3 }
        );

        const result: SpeakingEvaluationResult = JSON.parse(response);

        // Save result to DB
        await prisma.speakingEvaluation.update({
          where: { id: evaluationId },
          data: {
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
      concurrency: 1, // Speaking is heavier (STT + LLM), process 1 at a time
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
