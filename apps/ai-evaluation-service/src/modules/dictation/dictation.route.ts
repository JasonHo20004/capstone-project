// =============================================================================
// AI Evaluation Service - Dictation Check Route (TASK-10)
// Uses Levenshtein distance to compare user input vs original transcript
// =============================================================================

import { Router, Request, Response } from "express";

const router = Router();

/**
 * Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Compare word-by-word using LCS (Longest Common Subsequence)
 * Returns each word with status: "correct" | "wrong" | "missing"
 */
function compareTranscripts(
  userInput: string,
  original: string
): Array<{ word: string; expected?: string; status: "correct" | "wrong" | "missing" }> {
  const userWords = userInput.trim().toLowerCase().split(/\s+/);
  const origWords = original.trim().toLowerCase().split(/\s+/);

  const result: Array<{ word: string; expected?: string; status: "correct" | "wrong" | "missing" }> = [];

  // LCS-based alignment
  const m = userWords.length;
  const n = origWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (userWords[i - 1] === origWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build alignment
  let i = m, j = n;
  const aligned: Array<{ user: string | null; orig: string | null }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && userWords[i - 1] === origWords[j - 1]) {
      aligned.unshift({ user: userWords[i - 1], orig: origWords[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      aligned.unshift({ user: null, orig: origWords[j - 1] });
      j--;
    } else {
      aligned.unshift({ user: userWords[i - 1], orig: null });
      i--;
    }
  }

  // Convert alignment to result
  for (const pair of aligned) {
    if (pair.user && pair.orig && pair.user === pair.orig) {
      result.push({ word: pair.user, status: "correct" });
    } else if (pair.user && !pair.orig) {
      result.push({ word: pair.user, status: "wrong", expected: "" });
    } else if (!pair.user && pair.orig) {
      result.push({ word: pair.orig, status: "missing" });
    } else if (pair.user && pair.orig) {
      result.push({ word: pair.user, expected: pair.orig, status: "wrong" });
    }
  }

  return result;
}

/**
 * POST /api/ai/dictation/check
 * Compare user's dictation input vs original transcript
 * Input: { userInput: string, originalTranscript: string }
 */
router.post("/check", async (req: Request, res: Response) => {
  try {
    const { userInput, originalTranscript } = req.body;

    if (!userInput || !originalTranscript) {
      res.status(400).json({
        success: false,
        error: "userInput and originalTranscript are required",
      });
      return;
    }

    const comparison = compareTranscripts(userInput, originalTranscript);
    const correctCount = comparison.filter(w => w.status === "correct").length;
    const totalOrigWords = originalTranscript.trim().split(/\s+/).length;
    const accuracy = Math.round((correctCount / totalOrigWords) * 100);
    const distance = levenshteinDistance(
      userInput.trim().toLowerCase(),
      originalTranscript.trim().toLowerCase()
    );

    res.json({
      success: true,
      data: {
        words: comparison,
        accuracy,
        correctCount,
        totalWords: totalOrigWords,
        levenshteinDistance: distance,
      },
    });
  } catch (error: any) {
    console.error("❌ [Dictation] Check error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
