import { IeltsGapFillStrategy } from "./ielts-gap-fill.strategy.js";

/**
 * Handles: TOEIC_TEXT_COMPLETION (Part 6)
 * Functionally identical to GAP_FILL but kept separate for future overrides.
 *
 * answerData:    { "131": ["assume", "begin"] }
 * studentAnswer: { "131": "assume" }
 */
export class ToeicTextCompletionStrategy extends IeltsGapFillStrategy {
  // Future: override evaluate() here for TOEIC-specific scoring rules
}
