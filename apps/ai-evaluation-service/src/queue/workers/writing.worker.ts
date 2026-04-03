// =============================================================================
// AI Evaluation Service - Writing Evaluation Worker (Gemini)
// =============================================================================

import { Worker, Job } from "bullmq";
import { WritingJobData, WritingEvaluationResult } from "../types.js";
import { geminiClient } from "../../llm/gemini.client.js";
import { WRITING_TASK1_PROMPT, WRITING_TASK2_PROMPT } from "../../llm/prompts.js";
import { databaseService } from "../../services/database.service.js";

const QUEUE_NAME = "ai-evaluation-queue";

/**
 * Fetches an image from a URL and returns base64 data + mimeType.
 */
async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log(`🖼️ [Worker] Fetching chart image: ${imageUrl.slice(0, 80)}...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.warn(`⚠️ [Worker] Image fetch failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const mimeType = contentType.split(";")[0].trim();
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log(`✅ [Worker] Image fetched: ${mimeType}, ${Math.round(arrayBuffer.byteLength / 1024)}KB`);
    return { base64, mimeType };
  } catch (err) {
    console.warn(`⚠️ [Worker] Image fetch error:`, err);
    return null;
  }
}

export function createWritingWorker(): Worker {
  const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  };

  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<WritingJobData>) => {
      if (job.name !== "GRADE_WRITING") return;

      const { evaluationId, essayText, userId, taskType, question, imageUrl } = job.data;
      console.log(`📝 [Worker] Processing writing evaluation ${evaluationId} for user ${userId} (Task ${taskType || 2})`);

      const prisma = databaseService.getClient();

      try {
        // Update status to PROCESSING
        await prisma.writingEvaluation.update({
          where: { id: evaluationId },
          data: { status: "PROCESSING" },
        });

        // Select prompt based on task type (default: Task 2)
        const prompt = taskType === 1 ? WRITING_TASK1_PROMPT : WRITING_TASK2_PROMPT;

        // Build user message with question context
        let userMessage = `Please evaluate the following IELTS Writing Task ${taskType || 2} response:\n\n`;
        if (question) {
          userMessage += `**Question/Topic:** ${question}\n\n`;
        }
        userMessage += `**Essay:**\n${essayText}`;

        let response: string;

        // For Task 1 with image: use multimodal (image + text) completion
        if (taskType === 1 && imageUrl) {
          const imageData = await fetchImageAsBase64(imageUrl);

          if (imageData) {
            console.log(`🤖 [Worker] Using multimodal completion (image + text) for Task 1`);
            const textPrompt = `${userMessage}\n\n**IMPORTANT:** The image attached is the chart/graph/diagram that the student was asked to describe. Use it to evaluate Task Achievement — check whether the student accurately described the key features shown in the image.`;

            response = await geminiClient.multimodalCompletion(
              prompt,
              imageData.base64,
              imageData.mimeType,
              textPrompt,
              { temperature: 0.2, useProModel: false },
            );
          } else {
            // Fallback: text-only if image fetch failed
            console.warn(`⚠️ [Worker] Image fetch failed, falling back to text-only evaluation`);
            userMessage += `\n\n**Note:** The original chart/graph image could not be loaded. Please evaluate based on the writing quality alone, but note that Task Achievement cannot be fully assessed without the visual data.`;
            response = await geminiClient.chatCompletion(prompt, userMessage, { temperature: 0.2, useProModel: false });
          }
        } else {
          // Task 2 or Task 1 without image: text-only
          response = await geminiClient.chatCompletion(prompt, userMessage, { temperature: 0.2, useProModel: false });
        }

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
              message: `Your IELTS Writing Task ${taskType || 2} assessment has been graded. You scored Band ${result.overall_band}.`,
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
      concurrency: 2,
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
