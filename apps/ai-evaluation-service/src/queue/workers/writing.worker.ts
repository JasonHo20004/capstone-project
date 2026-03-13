// =============================================================================
// AI Evaluation Service - Writing Evaluation Worker
// =============================================================================

import { Worker, Job } from "bullmq";
import { WritingJobData, WritingEvaluationResult } from "../types.js";
import { llmClient } from "../../llm/llm.client.js";
import { WRITING_EVALUATION_PROMPT } from "../../llm/prompts.js";
import { databaseService } from "../../services/database.service.js";

const QUEUE_NAME = "ai-evaluation-queue";

export function createWritingWorker(): Worker {
  const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  };

  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<WritingJobData>) => {
      if (job.name !== "GRADE_WRITING") return;

      const { evaluationId, essayText, userId } = job.data;
      console.log(`📝 [Worker] Processing writing evaluation ${evaluationId} for user ${userId}`);

      const prisma = databaseService.getClient();

      try {
        // Update status to PROCESSING
        await prisma.writingEvaluation.update({
          where: { id: evaluationId },
          data: { status: "PROCESSING" },
        });

        // Call Groq LLM for evaluation
        const response = await llmClient.chatCompletion(
          WRITING_EVALUATION_PROMPT,
          `Please evaluate the following IELTS Writing Task 2 essay:\n\n${essayText}`,
          { jsonMode: true, temperature: 0.3 }
        );

        const result: WritingEvaluationResult = JSON.parse(response);

        // Save result to DB
        await prisma.writingEvaluation.update({
          where: { id: evaluationId },
          data: {
            overallBand: result.overall_band,
            criteria: result.criteria as any,
            highlightedErrors: result.highlighted_errors as any,
            overallFeedback: result.overall_feedback,
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // Notify user via Notification Service
        try {
          const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006";
          await fetch(`${notificationUrl}/api/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              title: "Writing Assessment Complete",
              message: `Your IELTS Writing assessment has been graded. You scored Band ${result.overall_band}.`,
              type: "AI_GRADING",
              metadata: { evaluationId, overallBand: result.overall_band },
            }),
          });
        } catch (notifyErr) {
          console.warn("⚠️ [Worker] Failed to send notification:", notifyErr);
        }

        console.log(`✅ [Worker] Writing evaluation ${evaluationId} completed — Band ${result.overall_band}`);
        return result;
      } catch (error) {
        console.error(`❌ [Worker] Writing evaluation ${evaluationId} failed:`, error);

        // Update status to FAILED
        await prisma.writingEvaluation.update({
          where: { id: evaluationId },
          data: { status: "FAILED" },
        });

        throw error; // BullMQ will retry
      }
    },
    {
      connection,
      concurrency: 2, // Process 2 writing jobs concurrently
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
