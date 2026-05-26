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
import { instructionDetectorService } from "./services/instruction-detector.service.js";

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

export interface ParseResponse {
  metadata: {
    fileType: SupportedFileType;
    wordCount: number;
    characterCount: number;
    pageCount?: number;
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
    const normalised = textNormalizationService.normalize(extracted.rawText);

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
      const { options, questionBody } = optionParserService.parse(block.blockText);
      const warnings = [...block.warnings];

      if (options.length < 2) {
        warnings.push("Could not detect at least 2 options (A/B/C/D).");
      } else if (options.length < 4) {
        warnings.push(`Detected only ${options.length} options — expected 4.`);
      }

      const letters = answerKey.answers[String(block.questionNumber)];
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
        explanation: null,
        score: 1,
        sourceText: block.blockText,
        parserWarnings: warnings,
        sectionInstruction: instructionMap.get(block.questionNumber),
      };
    });

    const withAnswer = questions.filter((q) => q.correctAnswerIndex !== null).length;
    const warningCount = questions.reduce(
      (acc, q) => acc + q.parserWarnings.length,
      0
    );

    return {
      metadata: {
        fileType: validated.type,
        wordCount: extracted.wordCount,
        characterCount: extracted.characterCount,
        pageCount: extracted.pageCount,
      },
      questions,
      summary: {
        totalParsed: questions.length,
        withAnswer,
        withoutAnswer: questions.length - withAnswer,
        warningCount,
      },
      unparsedText: unparsedText || undefined,
    };
  }
}

export const questionImportService = new QuestionImportService();
