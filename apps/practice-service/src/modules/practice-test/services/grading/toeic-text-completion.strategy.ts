import { IeltsGapFillStrategy } from "./ielts-gap-fill.strategy.js";

/**
 * TOEIC Part 6 (Text Completion) functions virtually identically to an IELTS gap fill,
 * but often uses multiple choice options for those gaps rather than free-text.
 * 
 * The evaluation logic from a computational standpoint remains identical though 
 * (matching a submitted ID/String against an array/single correct option).
 * Therefore, we can inherit the IELTS gap fill behavior, but keep this file 
 * distinctly named so the architecture remains decoupled for future TOEIC-specific overrides.
 */
export class ToeicTextCompletionStrategy extends IeltsGapFillStrategy {
  // If TOEIC ever adds unique rules for Text Completion (e.g. partial penalizations),
  // we would override the `evaluate` method here instead of dirtying the IELTS one.
}
