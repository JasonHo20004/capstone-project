import { databaseService } from "@/services/database.service";
import type { AnswerQuestionResponse } from "@/modules/practice_sessions/dtos/practiceSession.dto";

export class UserAnswerRepository {
  private prisma = databaseService.getClient();

  public async upsertAnswer(data: {
    userId: string;
    questionId: string;
    selectedOptionIndex: number;
    answerText: string;
    sessionId: string;
  }): Promise<AnswerQuestionResponse> {
    return this.prisma.userAnswer.upsert({
      where: {
        practiceSessionId_questionId_userId: {
          practiceSessionId: data.sessionId,
          questionId: data.questionId,
          userId: data.userId,
        },
      },
      update: {
        selectedOptionIndex: data.selectedOptionIndex,
        answerText: data.answerText,
        isCorrect: null,
      },
      create: {
        practiceSessionId: data.sessionId,
        questionId: data.questionId,
        userId: data.userId,
        selectedOptionIndex: data.selectedOptionIndex,
        answerText: data.answerText,
        isCorrect: null,
      },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
        question:{
          select:{questionText:true, questionType:true }
        }
      },
    });
  }
}
