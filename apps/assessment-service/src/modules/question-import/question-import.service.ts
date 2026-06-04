// =============================================================================
// Question Import Service (Orchestrator)
// =============================================================================
// Composes the per-step services into a single stateless parse pipeline.
// Does NOT touch the DB — the response is consumed by the seller UI form.

import {
  fileValidationService,
  FileValidationError,
  type SupportedFileType,
} from "./services/file-validation.service.js";
import { textExtractionService } from "./services/text-extraction.service.js";
import { textNormalizationService } from "./services/text-normalization.service.js";
import { questionParserService } from "./services/question-parser.service.js";
import { optionParserService } from "./services/option-parser.service.js";
import { answerKeyParserService } from "./services/answer-key-parser.service.js";
import { inlineAnswerParserService } from "./services/inline-answer-parser.service.js";
import { summaryTableStripperService } from "./services/summary-table-stripper.service.js";
import { instructionDetectorService } from "./services/instruction-detector.service.js";
import { confidenceService } from "./services/confidence.service.js";
import {
  llmQuestionExtractorService,
  type ExtractedQuestion,
} from "./services/llm-question-extractor.service.js";

export interface ParsedOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface ParsedQuestion {
  questionNumber: number;
  questionType: "MULTIPLE_CHOICE";
  questionText: string;
  options: ParsedOption[];
  correctAnswerIndex: number | null;
  explanation: string | null;
  score: number;
  sourceText: string;
  parserWarnings: string[];
  /**
   * Instruction text for the section this question belongs to.
   * Only populated on the **first** question of each detected section;
   * undefined for subsequent questions in the same section.
   */
  sectionInstruction?: string;
}

/** Which engine produced the returned questions. */
export type ParseStrategy = "deterministic" | "llm";

export interface ParseResponse {
  metadata: {
    fileType: SupportedFileType;
    wordCount: number;
    characterCount: number;
    pageCount?: number;
    /** Engine that produced `questions` (deterministic parser or LLM fallback). */
    parseStrategy: ParseStrategy;
    /** Deterministic-parse confidence (0–1) that drove the strategy choice. */
    confidence: number;
  };
  questions: ParsedQuestion[];
  summary: {
    totalParsed: number;
    withAnswer: number;
    withoutAnswer: number;
    warningCount: number;
  };
  unparsedText?: string;
}

export { FileValidationError };

const LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

// Cap the text size sent to the LLM so a pathological upload can't run up an
// unbounded bill AND so input tokens never crowd out the completion budget on
// Groq's 8000 TPM free tier (see llm-question-extractor for the TPM math).
// ~12k chars ≈ 5k input tokens, leaving room for a usable JSON completion;
// larger docs keep the deterministic result.
const MAX_LLM_INPUT_CHARS = 12_000;

export class QuestionImportService {
  async parseFile(file: {
    originalname?: string;
    mimetype?: string;
    buffer?: Buffer;
    size?: number;
  }): Promise<ParseResponse> {
    // 1. Validate file shape and size.
    const validated = await fileValidationService.validate(file);

    // 2. Extract raw text per file type.
    const extracted =
      validated.type === "pdf"
        ? await textExtractionService.extractFromPdf(validated.buffer)
        : await textExtractionService.extractFromDocx(validated.buffer);

    // 3. Reject scanned PDFs (very little text).
    fileValidationService.assertPdfHasEnoughText(
      validated.type,
      extracted.wordCount
    );

    // 4. Normalise text.
    const normalisedRaw = textNormalizationService.normalize(extracted.rawText);

    // 4b. Strip a trailing answer-summary grid ("Quiz | Answer" table) so it
    //     doesn't get appended to the last question's block.
    const normalised = summaryTableStripperService.strip(normalisedRaw);

    // 5. Extract the answer key block (if any) BEFORE splitting into questions
    //    so its `1. A` lines don't get misread as fallback question markers.
    const answerKey = answerKeyParserService.parse(normalised);
    const textWithoutAnswerKey = answerKey.blockRange
      ? (
          normalised.slice(0, answerKey.blockRange.start) +
          normalised.slice(answerKey.blockRange.end)
        ).trim()
      : normalised;

    // 6. Detect section instruction blocks (e.g. "Read the following passage…from 1 to 6").
    //    Returns Map<firstQuestionNumber, instructionText>.
    const instructionMap = instructionDetectorService.detect(textWithoutAnswerKey);

    // 7. Parse question blocks.
    const { blocks, unparsedText } = questionParserService.parse(
      textWithoutAnswerKey
    );

    // 8. Parse options for each block + apply answer key + stamp section instruction.
    const questions: ParsedQuestion[] = blocks.map((block) => {
      const warnings = [...block.warnings];

      // 8a. Pull out any inline answer/explanation BEFORE option parsing so the
      //     "Correct answer:" / "Explanation:" lines don't leak into option D.
      const inline = inlineAnswerParserService.parse(block.blockText);
      const { options, questionBody } = optionParserService.parse(inline.body);

      if (options.length < 2) {
        warnings.push("Could not detect at least 2 options (A/B/C/D).");
      } else if (options.length < 4) {
        warnings.push(`Detected only ${options.length} options — expected 4.`);
      }

      // 8b. Resolve the answer: prefer the inline letter, fall back to the
      //     document-level answer key.
      const letters = inline.correctLetter
        ? [inline.correctLetter]
        : answerKey.answers[String(block.questionNumber)];

      let correctAnswerIndex: number | null = null;
      if (letters && letters.length > 0) {
        if (letters.length > 1) {
          warnings.push(
            `Multiple correct answers detected (${letters.join(", ")}). M1 supports only single-answer MCQ — first answer used.`
          );
        }
        const idx = LETTER_TO_INDEX[letters[0]];
        if (typeof idx === "number" && idx < options.length) {
          correctAnswerIndex = idx;
        } else if (typeof idx === "number") {
          warnings.push(
            `Answer letter ${letters[0]} doesn't match a parsed option.`
          );
        }
      } else {
        warnings.push("No answer key detected for this question.");
      }

      return {
        questionNumber: block.questionNumber,
        questionType: "MULTIPLE_CHOICE" as const,
        questionText: questionBody,
        options,
        correctAnswerIndex,
        explanation: inline.explanation,
        score: 1,
        sourceText: block.blockText,
        parserWarnings: warnings,
        sectionInstruction: instructionMap.get(block.questionNumber),
      };
    });

    // 9. Score the deterministic parse. A low score (e.g. nothing parsed, many
    //    missing answers, lots of leftover text) routes the document to the LLM.
    const confidence = confidenceService.evaluate({
      questionCount: questions.length,
      questionsWithoutAnswer: questions.filter((q) => q.correctAnswerIndex === null)
        .length,
      questionsWithFewOptions: questions.filter((q) => q.options.length < 4).length,
      unparsedLength: unparsedText.length,
      normalisedLength: normalised.length,
    });

    // 10. LLM fallback — only when confidence is low, the client is configured,
    //     and the input is within the size cap. Any failure keeps the
    //     deterministic result (the extractor returns null, never throws).
    let finalQuestions = questions;
    let parseStrategy: ParseStrategy = "deterministic";
    let finalUnparsedText = unparsedText;

    const isLlmAvailable = llmQuestionExtractorService.isAvailable();
    const withinSizeCap = normalised.length <= MAX_LLM_INPUT_CHARS;
    const eligibleForLlm =
      confidence.shouldUseLlm && isLlmAvailable && withinSizeCap;

    // DIAGNOSTIC: explain why the LLM fallback did or did not run. Remove once
    // the deterministic-vs-LLM routing is confirmed working in this environment.
    console.log(
      "[question-import] LLM fallback gate:",
      JSON.stringify({
        confidenceScore: Number(confidence.score.toFixed(2)),
        shouldUseLlm: confidence.shouldUseLlm,
        confidenceReasons: confidence.reasons,
        isLlmAvailable,
        withinSizeCap,
        normalisedLength: normalised.length,
        maxLlmInputChars: MAX_LLM_INPUT_CHARS,
        eligibleForLlm,
      })
    );

    if (eligibleForLlm) {
      const llmQuestions = await llmQuestionExtractorService.extract(normalised);
      if (llmQuestions && llmQuestions.length > 0) {
        finalQuestions = this.mapExtractedQuestions(llmQuestions, instructionMap);
        parseStrategy = "llm";
        finalUnparsedText = ""; // LLM consumed the whole document.
        console.log(
          `[question-import] LLM fallback succeeded — extracted ${llmQuestions.length} question(s).`
        );
      } else {
        console.warn(
          "[question-import] LLM fallback eligible but extract() returned no usable questions — keeping deterministic result."
        );
      }
    }

    const withAnswer = finalQuestions.filter(
      (q) => q.correctAnswerIndex !== null
    ).length;
    const warningCount = finalQuestions.reduce(
      (acc, q) => acc + q.parserWarnings.length,
      0
    );

    return {
      metadata: {
        fileType: validated.type,
        wordCount: extracted.wordCount,
        characterCount: extracted.characterCount,
        pageCount: extracted.pageCount,
        parseStrategy,
        confidence: Number(confidence.score.toFixed(2)),
      },
      questions: finalQuestions,
      summary: {
        totalParsed: finalQuestions.length,
        withAnswer,
        withoutAnswer: finalQuestions.length - withAnswer,
        warningCount,
      },
      unparsedText: finalUnparsedText || undefined,
    };
  }

  /**
   * Maps LLM-extracted questions to the pipeline's ParsedQuestion shape,
   * numbering them sequentially and stamping section instructions. Each carries
   * a review warning so the seller knows to verify AI output.
   */
  private mapExtractedQuestions(
    extracted: ExtractedQuestion[],
    instructionMap: Map<number, string>
  ): ParsedQuestion[] {
    return extracted.map((q, idx) => {
      const questionNumber = idx + 1;
      const warnings = ["Extracted by AI — please review for accuracy."];

      if (q.options.length < 2) {
        warnings.push("Could not detect at least 2 options (A/B/C/D).");
      } else if (q.options.length < 4) {
        warnings.push(`Detected only ${q.options.length} options — expected 4.`);
      }
      if (q.correctAnswerIndex === null) {
        warnings.push("No answer detected for this question.");
      }

      return {
        questionNumber,
        questionType: "MULTIPLE_CHOICE" as const,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
        score: 1,
        sourceText: q.questionText,
        parserWarnings: warnings,
        sectionInstruction: instructionMap.get(questionNumber),
      };
    });
  }
}

export const questionImportService = new QuestionImportService();
