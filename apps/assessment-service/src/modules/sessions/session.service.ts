import { databaseService } from "../../services/database.service.js";
import { GradingContext } from "../grading/grading-context.js";
import { QuestionResult } from "../grading/grading-strategy.interface.js";
import { QuestionType, SessionStatus } from "../../../generated/prisma/index.js";

export class PracticeSessionService {

  public async createSession(userId: string, testId: string, selectedSections: string[]) {
    const prisma = databaseService.getClient();

    // Verify test exists
    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new Error("Test not found");

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        testId,
        selectedSections,
        status: SessionStatus.ONGOING,
      },
    });

    return session;
  }

  public async getSession(sessionId: string) {
    const prisma = databaseService.getClient();

    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            durationInMinutes: true,
            englishTestType: { select: { name: true } },
          },
        },
        userAnswers: {
          select: {
            id: true,
            questionId: true,
            answerText: true,
            selectedOptionIndex: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!session) throw new Error("Session not found");
    return session;
  }

  public async submitSession(
    sessionId: string,
    userId: string,
    submissions: Record<string, any>
  ) {
    const prisma = databaseService.getClient();

    // 1. Load full session + test with answers (server-side only)
    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            sections: {
              include: {
                questions: true,
              },
            },
            questions: true, // direct questions on test
          },
        },
      },
    });

    if (!session) throw new Error("Session not found");
    if (session.status === SessionStatus.COMPLETED) throw new Error("Session already submitted");
    if (session.userId !== userId) throw new Error("Unauthorized");

    // 2. Collect all questions to grade
    const allQuestions = [
      ...session.test.questions,
      ...session.test.sections.flatMap((s) => s.questions),
    ];

    // 3. Grade each question using Strategy Pattern
    const results: QuestionResult[] = [];
    const rawScoresBySkill: Record<string, number> = {};

    for (const question of allQuestions) {
      const studentAnswer = submissions[question.id];

      // Only auto-grade questions that have a strategy
      if (!GradingContext.isAutoGradeable(question.questionType)) {
        // Writing/Speaking: save answer text for teacher/AI review later
        results.push({
          questionId: question.id,
          isCorrect: false,
          score: 0,
          studentAnswer: studentAnswer ?? null,
        });
        continue;
      }

      const strategy = GradingContext.getStrategy(question.questionType);
      const score = strategy.evaluate(question.answer, studentAnswer);
      const isCorrect = score > 0;

      results.push({
        questionId: question.id,
        isCorrect,
        score,
        studentAnswer: studentAnswer ?? null,
        explanation: question.explanation ?? undefined,
      });
    }

    // 4. Tally raw scores by skill
    const totalRaw = results.reduce((acc, r) => acc + r.score, 0);

    // 5. Look up ScoreConversion for official TOEIC/IELTS band
    //    (Using the test's EnglishTestTypeId for the lookup)
    const testWithType = await prisma.test.findUnique({
      where: { id: session.testId },
      select: { englishTestTypeId: true },
    });

    let overallScaledScore: number | null = null;
    if (testWithType) {
      const conversion = await prisma.scoreConversion.findFirst({
        where: {
          englishTestTypeId: testWithType.englishTestTypeId,
          rawScore: totalRaw,
        },
      });
      overallScaledScore = conversion?.scaledScore ?? null;
    }

    // 6. Save all UserAnswer rows + complete session atomically.
    //    Use conditional updateMany to prevent double-submit race condition:
    //    only the first request that flips status ONGOING→COMPLETED proceeds.
    await databaseService.transaction(async (tx) => {
      const claim = await tx.practiceSession.updateMany({
        where: { id: sessionId, status: SessionStatus.ONGOING },
        data: {
          status: SessionStatus.COMPLETED,
          completedAt: new Date(),
          overallScaledScore,
          rawScoresBySkill: rawScoresBySkill,
        },
      });
      if (claim.count === 0) {
        throw new Error("Session already submitted");
      }

      await tx.userAnswer.createMany({
        data: results.map((r) => ({
          practiceSessionId: sessionId,
          questionId: r.questionId,
          userId,
          isCorrect: r.isCorrect,
          answerText:
            typeof r.studentAnswer === "string"
              ? r.studentAnswer
              : JSON.stringify(r.studentAnswer),
          selectedOptionIndex: null,
        })),
        skipDuplicates: true,
      });
    });

    return {
      sessionId,
      status: "COMPLETED",
      totalRaw,
      overallScaledScore,
      detail: results,
    };
  }
}

export const practiceSessionService = new PracticeSessionService();
