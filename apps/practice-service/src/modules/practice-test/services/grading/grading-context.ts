import { QuestionType } from "../../../../../generated/prisma/index.js";
import { IGradingStrategy } from "./grading-strategy.interface.js";
import { IeltsGapFillStrategy } from "./ielts-gap-fill.strategy.js";
import { IeltsMultipleChoiceStrategy } from "./ielts-multiple-choice.strategy.js";
import { ToeicSingleChoiceStrategy } from "./toeic-single-choice.strategy.js";
import { ToeicTextCompletionStrategy } from "./toeic-text-completion.strategy.js";

export class GradingContext {
  private static strategies: Partial<Record<QuestionType, IGradingStrategy>> = {
    [QuestionType.GAP_FILL]: new IeltsGapFillStrategy(),
    [QuestionType.MULTIPLE_CHOICE]: new IeltsMultipleChoiceStrategy(),
    [QuestionType.TRUE_FALSE_NOT_GIVEN]: new IeltsMultipleChoiceStrategy(), // Works identically
    [QuestionType.MATCHING]: new IeltsGapFillStrategy(), // Works identically: map ID to matching letter
    [QuestionType.TOEIC_SINGLE_CHOICE]: new ToeicSingleChoiceStrategy(),
    [QuestionType.TOEIC_TEXT_COMPLETION]: new ToeicTextCompletionStrategy()
  };

  public static getStrategy(type: QuestionType): IGradingStrategy {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new Error(`Strategy for question type ${type} is not implemented`);
    }
    return strategy;
  }
}
