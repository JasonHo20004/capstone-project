// =============================================================================
// Parse Confidence Scorer
// =============================================================================
// Scores how well the deterministic parser handled a document so the
// orchestrator can decide whether to fall back to the LLM extractor. The score
// is derived entirely from signals the pipeline already produces — no extra
// work, no I/O — and is deliberately explainable (each penalty has a reason).

export interface ConfidenceInput {
  /** Number of questions the deterministic parser produced. */
  questionCount: number;
  /** Questions that ended up with no resolved correct answer. */
  questionsWithoutAnswer: number;
  /** Questions with fewer than 4 options (A–D). */
  questionsWithFewOptions: number;
  /** Length of the leftover/unparsed text. */
  unparsedLength: number;
  /** Length of the full normalised text fed to the parser. */
  normalisedLength: number;
}

export interface ConfidenceResult {
  /** 0 (useless) … 1 (clean parse). */
  score: number;
  /** Whether the caller should attempt the LLM fallback. */
  shouldUseLlm: boolean;
  /** Human-readable reasons for the deductions (for logs / telemetry). */
  reasons: string[];
}

// Below this score we don't trust the deterministic result enough to skip LLM.
const LOW_CONFIDENCE_THRESHOLD = 0.7;

// How much each problem class can subtract from a perfect score.
const NO_ANSWER_WEIGHT = 0.5;
const FEW_OPTIONS_WEIGHT = 0.35;
const LEFTOVER_WEIGHT = 0.3;
// Below this fraction, leftover text is treated as harmless trailing noise.
const LEFTOVER_TOLERANCE = 0.15;

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

export class ConfidenceService {
  evaluate(input: ConfidenceInput): ConfidenceResult {
    // Nothing parsed → zero confidence, always fall back.
    if (input.questionCount === 0) {
      return {
        score: 0,
        shouldUseLlm: true,
        reasons: ["Deterministic parser produced 0 questions."],
      };
    }

    const reasons: string[] = [];
    let score = 1;

    const noAnswerRatio = input.questionsWithoutAnswer / input.questionCount;
    if (noAnswerRatio > 0) {
      score -= noAnswerRatio * NO_ANSWER_WEIGHT;
      reasons.push(
        `${input.questionsWithoutAnswer}/${input.questionCount} questions have no detected answer.`
      );
    }

    const fewOptionsRatio = input.questionsWithFewOptions / input.questionCount;
    if (fewOptionsRatio > 0) {
      score -= fewOptionsRatio * FEW_OPTIONS_WEIGHT;
      reasons.push(
        `${input.questionsWithFewOptions}/${input.questionCount} questions have fewer than 4 options.`
      );
    }

    if (input.normalisedLength > 0) {
      const leftover = input.unparsedLength / input.normalisedLength;
      if (leftover > LEFTOVER_TOLERANCE) {
        const penalty = Math.min(leftover, LEFTOVER_WEIGHT);
        score -= penalty;
        reasons.push(
          `${Math.round(leftover * 100)}% of the document was left unparsed.`
        );
      }
    }

    score = clamp01(score);
    return {
      score,
      shouldUseLlm: score < LOW_CONFIDENCE_THRESHOLD,
      reasons,
    };
  }
}

export const confidenceService = new ConfidenceService();
