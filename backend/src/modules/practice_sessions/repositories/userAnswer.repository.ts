import { databaseService } from "@/services/database.service";
import type { AnswerQuestionResponse,UserAnswerSubmitResponse } from "@/modules/practice_sessions/dtos/userAnswer.dto";
import type { PrismaTx } from "@/services/database.service";

import type { UserAnswer } from "@prisma/client";
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
        question: {
          select: { questionText: true, questionType: true },
        },
      },
    });
  }
  public async findUserAnswers(data: {
    userId: string;
    sessionId: string;
  }): Promise<UserAnswer[]> {
    return this.prisma.userAnswer.findMany({
      where: { userId: data.userId,
      practiceSessionId: data.sessionId,  },
    });
  }
  public async findUserAnswers_InTx(data: {
    userId: string;
    sessionId: string;
  },tx:PrismaTx): Promise<UserAnswerSubmitResponse[]> {
    return tx.userAnswer.findMany({
      where: {userId: data.userId,
      practiceSessionId: data.sessionId, },
      include: { 
        user:{
          select:{
            fullName:true,
            email:true
          }
        },
          question: {
            select: {
              id: true,
              questionText: true,
              questionType:true,
              questionOrder:true,
              options: true,
              correctAnswer: true,
              correctAnswerIndex: true
            }
          } 
        },
    });
  }
  public async markForUserAnswer_InTx(
    data: { userAnswerId: string; isCorrect: boolean |null},
    tx: PrismaTx
  ): Promise<UserAnswer> {
    return tx.userAnswer.update({
      where: { id: data.userAnswerId},
      data: { isCorrect: data.isCorrect },
    });
  }
}
