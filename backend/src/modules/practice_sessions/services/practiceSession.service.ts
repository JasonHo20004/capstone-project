import { PracticeSessionRepository } from "@/modules/practice_sessions/repositories/practiceSession.repository";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { TestRepository } from "@/modules/tests/repositories/test.repository";
import { SectionRepository } from "@/modules/tests/repositories/section.repository";
// import { QuestionRepository } from "@/modules/tests/repositories/question.repository";
import type { CreateSessionResponse } from "@/modules/practice_sessions/dtos/practiceSession.dto";
import type {
  AnswerQuestionResponse,
  UserAnswerSubmitResponse,
} from "@/modules/practice_sessions/dtos/userAnswer.dto";
import { UserAnswerRepository } from "@/modules/practice_sessions/repositories/userAnswer.repository";
import { ScoreConversionRepository } from "@/modules/practice_sessions/repositories/scoreConversion.repository";
import { databaseService } from "@/services/database.service";
import type { SkillType } from "@prisma/client";

function roundIELTSScore(score: number): number {
  const decimal = score - Math.floor(score);
  if (decimal < 0.25) {
    return Math.floor(score); // .1 -> .0
  } else if (decimal < 0.75) {
    return Math.floor(score) + 0.5; // .25, .6 -> .5
  } else {
    return Math.ceil(score); // .75 -> 1.0
  }
}
export class PracticeSessionService {
  private practiceSessionRepository = new PracticeSessionRepository();
  private userRepository = new UserRepository();
  private testRepository = new TestRepository();
  private sectionRepository = new SectionRepository();
  private userAnswerRepository = new UserAnswerRepository();
  // private questionRepository = new QuestionRepository();
  private scoreConversionRepository = new ScoreConversionRepository();
  public async startSession(
    userId: string,
    testId: string,
    sectionIds: string[]
  ): Promise<CreateSessionResponse> {
    let sectionsToPractice: string[] = [];

    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw Error("Người dùng không tồn tại");
    }

    const existingTest = await this.testRepository.findById(testId);
    if (!existingTest) {
      throw Error("Khóa học không tồn tại ");
    }

    const existingSession =
      await this.practiceSessionRepository.findOnGoingSessionByTest({
        userId,
        testId,
      });
    if (existingSession) {
      throw Error("Phiên làm bài đang diễn ra!");
    }
    if (sectionIds && sectionIds.length > 0) {
      const sectionsInTest =
        await this.sectionRepository.findSectionByIds_InTest(
          testId,
          sectionIds
        );

      if (sectionsInTest.length !== sectionIds.length) {
        throw Error("Một số phần không có trong bài kiểm tra");
      }

      sectionsToPractice = sectionIds;
    } else {
      const allSections = await this.sectionRepository.findSectionByTest(
        testId
      );
      sectionsToPractice = allSections.map((section) => section.id);
    }

    const newSession = await this.practiceSessionRepository.createSession({
      userId,
      testId,
      selectedSections: sectionsToPractice,
    });
    return newSession;
  }
  public async answerQuestion(
    userId: string,
    data: {
      questionId: string;
      selectedOptionIndex: number;
      answerText: string;
      sessionId: string;
    }
  ): Promise<AnswerQuestionResponse> {
    const existingUser = await this.userRepository.findUserById(userId);
    const { questionId, selectedOptionIndex, answerText, sessionId } = data;

    if (!existingUser) {
      throw Error("Người dùng không tồn tại");
    }
    const existingSession =
      await this.practiceSessionRepository.findOnGoingSessionById({
        userId,
        sessionId,
      });

    if (!existingSession) {
      throw Error("Phiên làm bài không tồn tại hoặc đang diễn ra!");
    }
    const saveAnswer = await this.userAnswerRepository.upsertAnswer({
      userId,
      questionId,
      selectedOptionIndex,
      answerText,
      sessionId,
    });
    return saveAnswer;
  }

  public async submit(
    userId: string,
    sessionId: string
  ): Promise<UserAnswerSubmitResponse[]> {
    const session = await this.practiceSessionRepository.findOnGoingSessionById(
      {
        userId,
        sessionId,
      }
    );
    if (!session) {
      throw Error("Phiên làm bài không tồn tại hoặc không ở trạng thái ĐANG DIỄN RA");
    }
    const userAnswers = await this.userAnswerRepository.findUserAnswers({
      userId,
      sessionId,
    });
    if (!userAnswers) {
      throw Error("Người dùng chưa trả lời câu hỏi nào");
    }
    const sectionsInSession =
      await this.sectionRepository.findSectionsInSession(
        session.selectedSections
      );

    const correctAnswersMap = new Map<string, any>(); // Map<questionId, question>
    const questionToSkillMap = new Map<string, SkillType>();

    try {
      return databaseService.transaction(async (tx) => {
        for (const section of sectionsInSession) {
          for (const q of section.questions) {
            correctAnswersMap.set(q.id, q);
            questionToSkillMap.set(q.id, section.skill);
          }
        }
        const rawScoresBySkill: { [key in SkillType]?: number } = {};
        const updatePromises = [];

        for (const userAnswer of userAnswers) {
          const question = correctAnswersMap.get(userAnswer.questionId);
          const skill = questionToSkillMap.get(userAnswer.questionId);
          if (!question || !skill) continue;

          let isCorrect: boolean | null = false;

          switch (question.questionType) {
            case "MULTIPLE_CHOICE":
              isCorrect =
                userAnswer.selectedOptionIndex === question.correctAnswerIndex;
              break;
            case "FILL_IN_THE_BLANK":
              isCorrect =
                userAnswer.answerText?.trim().toLowerCase() ===
                question.correctAnswer?.trim().toLowerCase();
              break;
            case "ESSAY":
              isCorrect = null; // use AI to mark
              break;
          }

          if (isCorrect === true) {
            rawScoresBySkill[skill] = (rawScoresBySkill[skill] || 0) + 1;
          }
          updatePromises.push(
            this.userAnswerRepository.markForUserAnswer_InTx(
              {
                userAnswerId: userAnswer.id,
                isCorrect,
              },
              tx
            )
          );
        }
        await Promise.all(updatePromises);
        const conversionRules =
          await this.scoreConversionRepository.findScoreConversion(
            session.test.englishTestType.id
          );
        const conversionMap = new Map<SkillType, Map<number, number>>();
        for (const rule of conversionRules) {
          if (!conversionMap.has(rule.skill)) {
            conversionMap.set(rule.skill, new Map());
          }
          conversionMap.get(rule.skill)!.set(rule.rawScore, rule.scaledScore);
        }
        const scaledScoresBySkill: { [key: string]: number } = {};
        let totalScaledScore = 0;
        let skillsCount = 0;
        for (const skill of Object.keys(rawScoresBySkill)) {
          const rawScore = rawScoresBySkill[skill as SkillType]!;
          const skillMap = conversionMap.get(skill as SkillType);
          const scaledScore = skillMap?.get(rawScore) ?? 0; // Nếu ko có rule thì = 0

          scaledScoresBySkill[skill] = scaledScore;
          totalScaledScore += scaledScore;
          skillsCount++;
        }
        let overallScaledScore = 0;
        const testTypeName = session.test.englishTestType.name;
        if (testTypeName === "TOEIC") {
          // TOEIC: Plus score
          overallScaledScore = totalScaledScore;
        } else if (testTypeName === "IELTS") {
          // IELTS: Divide to averagge and round
          const avgScore = skillsCount > 0 ? totalScaledScore / skillsCount : 0;
          overallScaledScore = roundIELTSScore(avgScore);
        } else {
          // Default: Divide average
          overallScaledScore =
            skillsCount > 0 ? totalScaledScore / skillsCount : 0;
        }
        await this.practiceSessionRepository.submitSession_InTx(
          {
            sessionId,
            rawScoresBySkill,
            scaledScoresBySkill,
            overallScaledScore,
          },
          tx
        );
        return this.userAnswerRepository.findUserAnswers_InTx(
          { userId, sessionId },
          tx
        );
      });
    } catch (error: any) {
      throw Error("Nộp bài thất bại", error);
    }
  }
}