import { QuestionType } from "../../../generated/prisma/index.js";
import { IGradingStrategy } from "./grading-strategy.interface.js";
import { IeltsGapFillStrategy } from "./ielts-gap-fill.strategy.js";
import { IeltsMultipleChoiceStrategy } from "./ielts-multiple-choice.strategy.js";
import { ToeicSingleChoiceStrategy } from "./toeic-single-choice.strategy.js";
import { ToeicTextCompletionStrategy } from "./toeic-text-completion.strategy.js";

export class GradingContext {
  private static strategies: Partial<Record<QuestionType, IGradingStrategy>> = {
    // IELTS
    [QuestionType.GAP_FILL]: new IeltsGapFillStrategy(),
    [QuestionType.MATCHING]: new IeltsGapFillStrategy(),
    [QuestionType.MULTIPLE_CHOICE]: new IeltsMultipleChoiceStrategy(),
    [QuestionType.TRUE_FALSE_NOT_GIVEN]: new IeltsMultipleChoiceStrategy(),
    [QuestionType.FILL_IN_THE_BLANK]: new IeltsGapFillStrategy(),
    // TOEIC
    [QuestionType.TOEIC_SINGLE_CHOICE]: new ToeicSingleChoiceStrategy(),
    [QuestionType.TOEIC_TEXT_COMPLETION]: new ToeicTextCompletionStrategy(),
    // Future: IELTS_WRITING_TASK1, IELTS_WRITING_TASK2, IELTS_SPEAKING etc.
    // will be added here as AI/teacher grading strategies
  };

  public static getStrategy(type: QuestionType): IGradingStrategy {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new Error(`Grading strategy for question type "${type}" is not yet implemented`);
    }
    return strategy;
  }

  public static isAutoGradeable(type: QuestionType): boolean {
    return type in this.strategies;
  }
}
