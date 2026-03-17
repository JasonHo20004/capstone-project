// =============================================================================
// AI Evaluation Service - Writing Evaluation Routes (TASK-04)
// Direct inline evaluation (no Redis/BullMQ dependency)
// =============================================================================

import { Router, Request, Response } from "express";
import { databaseService } from "../../services/database.service.js";
import { llmClient } from "../../llm/llm.client.js";
import { geminiClient } from "../../llm/gemini.client.js";
import { deepseekClient } from "../../llm/deepseek.client.js";
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
 * Safely parse JSON with repair for truncated responses.
 */
function safeParseJSON(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    console.warn(`⚠️ JSON parse failed, attempting repair...`);
    let fixed = raw.trim();
    const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) fixed += '"';
    const opens = (fixed.match(/[{[]/g) || []).length;
    const closes = (fixed.match(/[}\]]/g) || []).length;
    for (let i = 0; i < opens - closes; i++) {
      fixed += fixed.lastIndexOf('{') > fixed.lastIndexOf('[') ? '}' : ']';
    }
    try {
      return JSON.parse(fixed);
    } catch {
      console.error(`❌ JSON repair failed. Raw (first 500):`, raw.slice(0, 500));
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}

/**
 * Round to nearest 0.5 (IELTS standard)
 */
function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
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
 * Applies hard caps that the LLM models refuse to self-apply.
 */
function calibrateScores(result: any, essayText: string): any {
  const features = analyzeEssayFeatures(essayText);
  console.log(`🔍 [Calibration] TTR: ${features.ttr}, Academic words: ${features.academicWordCount}, Complex ratio: ${features.complexSentenceRatio}, Basic connectors only: ${features.hasOnlyBasicConnectors}`);

  const calibrated = JSON.parse(JSON.stringify(result)); // deep clone

  // Lexical Resource cap: low vocabulary diversity + few academic words
  if (features.ttr < 0.45 && features.academicWordCount < 5) {
    const maxLexical = 6.5;
    if (calibrated.criteria.lexical?.score > maxLexical) {
      console.log(`📉 [Calibration] Lexical capped: ${calibrated.criteria.lexical.score} → ${maxLexical} (TTR=${features.ttr}, academic=${features.academicWordCount})`);
      calibrated.criteria.lexical.score = maxLexical;
    }
  }

  // Grammar cap: few complex structures
  if (features.complexSentenceRatio < 0.25) {
    const maxGrammar = 6.5;
    if (calibrated.criteria.grammar?.score > maxGrammar) {
      console.log(`📉 [Calibration] Grammar capped: ${calibrated.criteria.grammar.score} → ${maxGrammar} (complex ratio=${features.complexSentenceRatio})`);
      calibrated.criteria.grammar.score = maxGrammar;
    }
  }

  // Coherence cap: only basic connectors
  if (features.hasOnlyBasicConnectors) {
    const maxCoherence = 6.5;
    if (calibrated.criteria.coherence?.score > maxCoherence) {
      console.log(`📉 [Calibration] Coherence capped: ${calibrated.criteria.coherence.score} → ${maxCoherence} (basic connectors only)`);
      calibrated.criteria.coherence.score = maxCoherence;
    }
  }

  // Recalculate overall band after calibration
  const criteriaKeys = ["task_achievement", "coherence", "lexical", "grammar"];
  const avgOverall = criteriaKeys.reduce((sum, k) => sum + (calibrated.criteria[k]?.score || 0), 0) / criteriaKeys.length;
  calibrated.overall_band = roundToHalf(avgOverall);

  if (calibrated.overall_band !== result.overall_band) {
    console.log(`✅ [Calibration] Overall adjusted: ${result.overall_band} → ${calibrated.overall_band}`);
  }

  return calibrated;
}

/**
 * Run ensemble scoring: 3 models in parallel (2x Groq + 1x Gemini), average their scores.
 * Returns a single merged evaluation result.
 */
async function runEnsembleScoring(systemPrompt: string, userMessage: string): Promise<any> {
  // Run all 3 models in parallel
  const [groqResults, geminiResult] = await Promise.all([
    llmClient.ensembleCompletion(
      systemPrompt, userMessage, { jsonMode: true, temperature: 0, maxTokens: 8192 }
    ),
    geminiClient.chatCompletion(systemPrompt, userMessage, {
      temperature: 0, maxTokens: 8192, useProModel: true
    }).catch((err) => {
      console.warn(`⚠️ [Ensemble] Gemini failed, using 2-model fallback:`, err.message);
      return null;
    }),
  ]);

  // Parse all results
  const results: any[] = [];
  try {
    results.push(safeParseJSON(groqResults.modelA));
    console.log(`📊 [Ensemble] Groq A (gpt-oss-120b): ${results[results.length - 1].overall_band}`);
  } catch (e) { console.warn(`⚠️ Groq A parse failed`); }

  try {
    results.push(safeParseJSON(groqResults.modelB));
    console.log(`📊 [Ensemble] Groq B (llama-3.3-70b): ${results[results.length - 1].overall_band}`);
  } catch (e) { console.warn(`⚠️ Groq B parse failed`); }

  if (geminiResult) {
    try {
      results.push(safeParseJSON(geminiResult));
      console.log(`📊 [Ensemble] Gemini Pro: ${results[results.length - 1].overall_band}`);
    } catch (e) { console.warn(`⚠️ Gemini parse failed`); }
  }

  if (results.length === 0) {
    throw new Error("All ensemble models failed");
  }

  console.log(`📊 [Ensemble] ${results.length} models succeeded`);

  // Average criterion scores across all successful results
  const criteriaKeys = ["task_achievement", "coherence", "lexical", "grammar"];
  const mergedCriteria: any = {};

  for (const key of criteriaKeys) {
    const validCriteria = results.map(r => r.criteria?.[key]).filter(Boolean);
    if (validCriteria.length === 0) continue;

    const avgScore = validCriteria.reduce((sum: number, c: any) => sum + c.score, 0) / validCriteria.length;
    // Pick the longest (most detailed) feedback and improvements
    const bestFeedback = validCriteria.reduce((best: any, c: any) =>
      (c.feedback?.length || 0) > (best.feedback?.length || 0) ? c : best
    );

    mergedCriteria[key] = {
      score: roundToHalf(avgScore),
      feedback: bestFeedback.feedback,
      improvements: validCriteria.reduce((best: string, c: any) =>
        (c.improvements?.length || 0) > (best?.length || 0) ? c.improvements : best
      , ""),
    };
  }

  // Recalculate overall band from averaged criteria
  const avgOverall = criteriaKeys.reduce((sum, k) => sum + (mergedCriteria[k]?.score || 0), 0) / criteriaKeys.length;

  // Merge errors from all models (deduplicate by original text)
  const allErrors: any[] = [];
  for (const r of results) {
    for (const err of (r.highlighted_errors || [])) {
      if (!allErrors.some((e: any) => e.original === err.original)) {
        allErrors.push(err);
      }
    }
  }

  // Pick the longest overall_feedback
  const bestOverallFeedback = results.reduce((best, r) =>
    (r.overall_feedback?.length || 0) > (best.overall_feedback?.length || 0) ? r : best
  ).overall_feedback;

  const mergedResult = {
    overall_band: roundToHalf(avgOverall),
    criteria: mergedCriteria,
    highlighted_errors: allErrors.slice(0, 10),
    overall_feedback: bestOverallFeedback,
    word_count: results[0].word_count || results[1]?.word_count,
  };

  console.log(`✅ [Ensemble] Final merged band: ${mergedResult.overall_band} (from ${results.length} models)`);
  return mergedResult;
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

        let response: string;
        let result: any;

        // For Task 1 with image: use Gemini multimodal (DeepSeek doesn't support images)
        if (taskType === 1 && imageUrl) {
          const imageData = await fetchImageAsBase64(imageUrl);
          if (imageData) {
            console.log(`🤖 [Direct] Using Gemini multimodal for Task 1 (image)`);
            const textPrompt = `${userMessage}\n\n**IMPORTANT:** The image attached is the chart/graph/diagram that the student was asked to describe. Use it to evaluate Task Achievement.`;
            response = await geminiClient.multimodalCompletion(
              prompt,
              imageData.base64,
              imageData.mimeType,
              textPrompt,
              { temperature: 0, maxTokens: 8192, useProModel: true },
            );
            result = safeParseJSON(response);
          } else {
            userMessage += `\n\n**Note:** The chart/graph image could not be loaded. Evaluate based on writing quality alone.`;
            // Use DeepSeek V3 as primary, Groq ensemble as fallback
            try {
              console.log(`🤖 [Direct] Using DeepSeek V3 for evaluation`);
              response = await deepseekClient.chatCompletion(prompt, userMessage, { temperature: 0, maxTokens: 8192 });
              result = safeParseJSON(response);
              console.log(`📊 [DeepSeek] Overall band: ${result.overall_band}`);
            } catch (dsErr: any) {
              console.warn(`⚠️ [Direct] DeepSeek failed, falling back to Groq ensemble:`, dsErr.message);
              result = await runEnsembleScoring(prompt, userMessage);
            }
          }
        } else {
          // Use DeepSeek V3 as primary, Groq ensemble as fallback
          try {
            console.log(`🤖 [Direct] Using DeepSeek V3 for evaluation`);
            response = await deepseekClient.chatCompletion(prompt, userMessage, { temperature: 0, maxTokens: 8192 });
            result = safeParseJSON(response);
            console.log(`📊 [DeepSeek] Overall band: ${result.overall_band}`);
          } catch (dsErr: any) {
            console.warn(`⚠️ [Direct] DeepSeek failed, falling back to Groq ensemble:`, dsErr.message);
            result = await runEnsembleScoring(prompt, userMessage);
          }
        }

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
