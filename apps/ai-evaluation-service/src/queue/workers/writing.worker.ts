// =============================================================================
// AI Evaluation Service - Writing Evaluation Worker (Gemini)
// =============================================================================

import { Worker, Job } from "bullmq";
import { WritingJobData, WritingEvaluationResult } from "../types.js";
import { getBullMQConnection } from "../redis-connection.js";
import { geminiClient, extractJson } from "../../llm/gemini.client.js";
import { WRITING_TASK1_PROMPT, WRITING_TASK2_PROMPT } from "../../llm/prompts.js";
import { databaseService } from "../../services/database.service.js";

const QUEUE_NAME = "ai-evaluation-queue";

/** Round to the nearest 0.5 and clamp to the valid IELTS band range [0, 9]. */
function normalizeBand(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.max(0, Math.min(9, n)) * 2) / 2;
}

/**
 * Parse the model's JSON response defensively. Gemini is asked for raw JSON
 * (responseMimeType=application/json), but can still wrap it in ``` fences or
 * trail prose, and a token-truncated reply is invalid JSON. Strip fences and
 * extract the outermost {...} so a stray character doesn't fail the whole job.
 */
function parseWritingResult(raw: string): WritingEvaluationResult {
  let text = (raw || "").trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    text = text.slice(start, end + 1);
  }
  return extractJson<WritingEvaluationResult>(text);
}

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
  const connection = getBullMQConnection();

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

        // Decide the grading strategy ONCE (resolve image, finalise the message)
        // so the retry loop below can safely re-issue the same call.
        let imageData: { base64: string; mimeType: string } | null = null;
        if (taskType === 1 && imageUrl) {
          imageData = await fetchImageAsBase64(imageUrl);
          if (!imageData) {
            console.warn(`⚠️ [Worker] Image fetch failed, falling back to text-only evaluation`);
            userMessage += `\n\n**Note:** The original chart/graph image could not be loaded. Please evaluate based on the writing quality alone, but note that Task Achievement cannot be fully assessed without the visual data.`;
          }
        }
        const imageTextPrompt = `${userMessage}\n\n**IMPORTANT:** The image attached is the chart/graph/diagram that the student was asked to describe. Use it to evaluate Task Achievement — check whether the student accurately described the key features shown in the image.`;

        // Pro model gives noticeably better-calibrated IELTS bands than Flash;
        // gemini.client auto-falls back to Flash if Pro is rate-limited. The
        // larger token budget prevents the long rubric JSON from being truncated.
        const callOpts = { temperature: 0.2, useProModel: true, maxTokens: 8192 } as const;

        const runGrading = async (): Promise<string> => {
          if (imageData) {
            console.log(`🤖 [Worker] Using multimodal completion (image + text) for Task 1 [Pro]`);
            return geminiClient.multimodalCompletion(
              prompt, imageData.base64, imageData.mimeType, imageTextPrompt, callOpts,
            );
          }
          return geminiClient.chatCompletion(prompt, userMessage, callOpts);
        };

        // Grade with one retry — covers a truncated/garbled JSON reply.
        let result: WritingEvaluationResult | null = null;
        let lastErr: unknown = null;
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await runGrading();
            result = parseWritingResult(response);
            break;
          } catch (err) {
            lastErr = err;
            console.warn(`⚠️ [Worker] Grading attempt ${attempt}/2 failed: ${err instanceof Error ? err.message : err}`);
          }
        }
        if (!result) throw lastErr ?? new Error("Writing grading produced no parseable result");

        // Trust the rubric (per-criterion) scores, not the model's arithmetic:
        // normalise each criterion and recompute overall_band as their mean. LLMs
        // routinely miscalculate the average, leaving the overall inconsistent.
        const crit = result.criteria;
        if (crit) {
          for (const key of ["task_achievement", "coherence", "lexical", "grammar"] as const) {
            if (crit[key]) crit[key].score = normalizeBand(Number(crit[key].score));
          }
          const parts = [
            crit.task_achievement?.score,
            crit.coherence?.score,
            crit.lexical?.score,
            crit.grammar?.score,
          ].map(Number);
          if (parts.every((s) => Number.isFinite(s))) {
            result.overall_band = normalizeBand(parts.reduce((a, b) => a + b, 0) / parts.length);
          } else {
            result.overall_band = normalizeBand(Number(result.overall_band));
          }
        } else {
          result.overall_band = normalizeBand(Number(result.overall_band));
        }

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
