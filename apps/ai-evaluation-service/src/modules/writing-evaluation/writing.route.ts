// =============================================================================
// AI Evaluation Service - Writing Evaluation Routes (TASK-04)
// Direct inline evaluation (no Redis/BullMQ dependency)
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { geminiClient, extractJson } from "../../llm/gemini.client.js";
import { WRITING_TASK1_PROMPT, WRITING_TASK2_PROMPT } from "../../llm/prompts.js";

/**
 * Fetches an image from a URL and returns base64 data + mimeType.
 */
async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log(`🖼️ [Writing] Fetching chart image: ${imageUrl.slice(0, 80)}...`);
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "image/png";
    const mimeType = contentType.split(";")[0].trim();
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    console.log(`✅ [Writing] Image fetched: ${mimeType}, ${Math.round(arrayBuffer.byteLength / 1024)}KB`);
    return { base64, mimeType };
  } catch (err) {
    console.warn(`⚠️ [Writing] Image fetch error:`, err);
    return null;
  }
}

/**
 * Safely parse a Gemini JSON response. Delegates to the shared extractJson, which
 * repairs markdown fences, stray prose, literal control chars inside strings,
 * trailing commas, and truncation (unclosed braces) before giving up.
 */
function safeParseJSON(raw: string): any {
  try {
    return extractJson(raw);
  } catch {
    console.error(`❌ JSON repair failed. Raw (first 500):`, raw.slice(0, 500));
    throw new Error('Failed to parse AI response as JSON');
  }
}

// Academic/sophisticated vocabulary indicators
const ACADEMIC_WORDS = new Set([
  "furthermore", "moreover", "consequently", "nevertheless", "notwithstanding",
  "albeit", "whereas", "henceforth", "predominantly", "subsequently",
  "inherently", "fundamentally", "substantially", "proliferation", "pedagogical",
  "demographic", "infrastructure", "sustainable", "unprecedented", "deteriorate",
  "exacerbate", "alleviate", "mitigate", "facilitate", "endeavour",
  "paradigm", "phenomenon", "implications", "significant", "considerable",
  "metropolitan", "metropolis", "inhabitants", "congestion", "provincial",
  "trajectory", "divergence", "stagnation", "acceleration", "fluctuation",
  "contend", "advocate", "undermine", "encompass", "perceive",
  "disproportionate", "indispensable", "detrimental", "conducive", "prevalent",
]);

// Complex sentence indicators (subordinating conjunctions, relative pronouns, etc.)
const COMPLEX_MARKERS = [
  /\b(although|though|even though|whereas|while|whilst)\b/gi,
  /\b(despite|in spite of|notwithstanding)\b/gi,
  /\b(which|whom|whose|whereby)\b/gi,
  /\b(provided that|on condition that|supposing)\b/gi,
  /\b(not only|neither|nor)\b/gi,
  /\b(having \w+ed|being \w+ed)\b/gi, // participial phrases
  /\b(were it|had it|should it)\b/gi, // inverted conditionals
];

/**
 * Analyze essay text to get objective feature metrics
 */
function analyzeEssayFeatures(text: string) {
  const words = text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 1);
  const uniqueWords = new Set(words);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);

  // Type-Token Ratio (vocabulary diversity)
  const ttr = words.length > 0 ? uniqueWords.size / words.length : 0;

  // Average words per sentence
  const avgWordsPerSentence = sentences.length > 0
    ? words.length / sentences.length : 0;

  // Count academic/uncommon words found
  const academicWordsFound = words.filter(w => ACADEMIC_WORDS.has(w));
  const academicWordCount = new Set(academicWordsFound).size;

  // Count complex sentence structures
  let complexSentenceCount = 0;
  for (const s of sentences) {
    if (COMPLEX_MARKERS.some(marker => marker.test(s))) {
      complexSentenceCount++;
    }
  }
  const complexSentenceRatio = sentences.length > 0 ? complexSentenceCount / sentences.length : 0;

  // Check for formulaic connectors only
  const hasOnlyBasicConnectors = /\b(firstly|secondly|thirdly|finally|in conclusion)\b/i.test(text)
    && !/(furthermore|moreover|consequently|nevertheless|in contrast|by contrast|on the contrary|notwithstanding)/i.test(text);

  return {
    ttr: Math.round(ttr * 100) / 100,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    academicWordCount,
    complexSentenceRatio: Math.round(complexSentenceRatio * 100) / 100,
    totalSentences: sentences.length,
    totalWords: words.length,
    hasOnlyBasicConnectors,
  };
}

/**
 * Post-processing score calibration based on objective text metrics.
 * We now rely on the LLM's strict instructions rather than regex hard-caps,
 * to avoid unfairly punishing highly natural/simple essays (like Simon's).
 */
function calibrateScores(result: any, essayText: string): any {
  const features = analyzeEssayFeatures(essayText);
  // Just log the features for debugging, no longer penalize scores
  console.log(`🔍 [Essay Features] TTR: ${features.ttr}, Academic words: ${features.academicWordCount}, Complex ratio: ${features.complexSentenceRatio}, Basic connectors only: ${features.hasOnlyBasicConnectors}`);

  return result; // Return LLM's original assessment unchanged
}

const router = Router();

/**
 * POST /api/ai/assessments/writing/submit
 * Submit essay for AI evaluation
 * Returns jobId immediately; grading happens in BullMQ worker
 */
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { essayText, questionId, sessionId, taskType, question, imageUrl } = req.body;
    let { userId } = req.body;

    // Extract userId from JWT Authorization header if not valid UUID in body
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!userId || !uuidRegex.test(userId)) {
      try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const jwtUserId = payload.sub || payload.userId || payload.id;
          if (jwtUserId && uuidRegex.test(jwtUserId)) {
            userId = jwtUserId;
          }
        }
      } catch (jwtErr) {
        console.warn("⚠️ [Writing] JWT parse failed:", jwtErr);
      }
    }

    if (!userId || !uuidRegex.test(userId)) {
      res.status(400).json({
        success: false,
        error: "Valid userId (UUID) is required. Please ensure you are logged in.",
      });
      return;
    }

    if (!essayText) {
      res.status(400).json({
        success: false,
        error: "essayText is required",
      });
      return;
    }

    if (essayText.length < 50) {
      res.status(400).json({
        success: false,
        error: "Essay is too short. Please write at least 50 characters.",
      });
      return;
    }

    const prisma = databaseService.getClient();

    // Create evaluation record in PENDING state
    const evaluation = await prisma.writingEvaluation.create({
      data: {
        userId,
        essayText,
        questionId: questionId || null,
        sessionId: sessionId || null,
        status: "PENDING",
      },
    });

    // Respond immediately — evaluation happens asynchronously below
    res.status(202).json({
      success: true,
      data: {
        evaluationId: evaluation.id,
        jobId: `direct-${evaluation.id}`,
        status: "PENDING",
        message: "Essay submitted for AI evaluation. This usually takes 15-30 seconds.",
      },
    });

    // ─── Direct inline evaluation (no Redis/BullMQ needed) ───────────────
    (async () => {
      try {
        // Update status to PROCESSING
        await prisma.writingEvaluation.update({
          where: { id: evaluation.id },
          data: { status: "PROCESSING" },
        });

        console.log(`📝 [Direct] Processing writing evaluation ${evaluation.id} for user ${userId} (Task ${taskType || 2})`);

        // Select prompt based on task type
        const prompt = taskType === 1 ? WRITING_TASK1_PROMPT : WRITING_TASK2_PROMPT;

        // Build user message
        let userMessage = `Please evaluate the following IELTS Writing Task ${taskType || 2} response:\n\n`;
        if (question) {
          userMessage += `**Question/Topic:** ${question}\n\n`;
        }
        userMessage += `**Essay:**\n${essayText}`;

        // Resolve the grading strategy ONCE (fetch image, finalise the message) so
        // the retry loop below can safely re-issue the same call.
        let imageData: { base64: string; mimeType: string } | null = null;
        if (taskType === 1 && imageUrl) {
          imageData = await fetchImageAsBase64(imageUrl);
          if (!imageData) {
            console.warn(`⚠️ [Direct] Image fetch failed, falling back to text-only evaluation`);
            userMessage += `\n\n**Note:** The chart/graph image could not be loaded. Evaluate based on writing quality alone.`;
          }
        }
        const imageTextPrompt = `${userMessage}\n\n**IMPORTANT:** The image attached is the chart/graph/diagram that the student was asked to describe. Use it to evaluate Task Achievement.`;

        // Grade with Gemini Pro only (the client auto-falls back to Flash internally).
        const callOpts = { temperature: 0, maxTokens: 8192, useProModel: true } as const;
        const runGrading = async (): Promise<string> => {
          if (imageData) {
            console.log(`🤖 [Direct] Using Gemini Pro multimodal for Task 1 (image)`);
            return geminiClient.multimodalCompletion(prompt, imageData.base64, imageData.mimeType, imageTextPrompt, callOpts);
          }
          console.log(`🤖 [Direct] Using Gemini Pro for evaluation`);
          return geminiClient.chatCompletion(prompt, userMessage, callOpts);
        };

        // Retry up to 3× — a transient 503/429 (all keys+models momentarily busy) or
        // a truncated/garbled JSON reply shouldn't fail the whole evaluation. Back off
        // briefly between attempts to let transient overload clear.
        let result: any = null;
        let lastErr: unknown = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const response = await runGrading();
            result = safeParseJSON(response);
            break;
          } catch (err) {
            lastErr = err;
            console.warn(`⚠️ [Direct] Grading attempt ${attempt}/3 failed: ${err instanceof Error ? err.message : err}`);
            if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500));
          }
        }
        if (!result) throw lastErr ?? new Error("Writing grading produced no parseable result");
        console.log(`📊 [Gemini Pro] Overall band: ${result.overall_band}`);

        // Post-processing calibration: apply objective text-metric-based score caps
        result = calibrateScores(result, essayText);

        // Save result to DB
        await prisma.writingEvaluation.update({
          where: { id: evaluation.id },
          data: {
            overallBand: result.overall_band,
            criteria: result.criteria as any,
            highlightedErrors: result.highlighted_errors as any,
            overallFeedback: result.overall_feedback,
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        console.log(`✅ [Direct] Writing evaluation ${evaluation.id} completed — Band ${result.overall_band}`);
      } catch (error) {
        console.error(`❌ [Direct] Writing evaluation ${evaluation.id} failed:`, error);
        await prisma.writingEvaluation.update({
          where: { id: evaluation.id },
          data: { status: "FAILED" },
        });
      }
    })();
  } catch (error: any) {
    console.error("❌ [Writing] Submit error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit essay",
    });
  }
});

/**
 * GET /api/ai/assessments/writing/:evaluationId
 * Poll for evaluation result
 */
router.get("/:evaluationId", async (req: Request, res: Response) => {
  try {
    const evaluationId = req.params.evaluationId as string;
    const prisma = databaseService.getClient();

    const evaluation = await prisma.writingEvaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      res.status(404).json({
        success: false,
        error: "Evaluation not found",
      });
      return;
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    console.error("❌ [Writing] Get error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get evaluation",
    });
  }
});

/**
 * GET /api/ai/assessments/writing/user/:userId
 * Get all writing evaluations for a user
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const prisma = databaseService.getClient();

    const evaluations = await prisma.writingEvaluation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error: any) {
    console.error("❌ [Writing] List error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list evaluations",
    });
  }
});

export default router;
