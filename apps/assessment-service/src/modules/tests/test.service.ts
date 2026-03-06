import { databaseService } from "../../services/database.service.js";
import { CreateTestDto } from "./test.schema.js";

export class TestService {

  public async getAllTests() {
    const prisma = databaseService.getClient();
    return await prisma.test.findMany({
      select: {
        id: true,
        title: true,
        durationInMinutes: true,
        totalScore: true,
        passingScore: true,
        practiceCount: true,
        createdAt: true,
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async getTestById(id: string) {
    const prisma = databaseService.getClient();
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        sections: {
          include: {
            passages: true,
            questions: {
              select: {
                id: true,
                questionText: true,
                questionType: true,
                options: true,
                content: true,
                explanation: true,
                questionOrder: true,
                imageUrl: true,
                wordLimit: true,
                // NEVER expose `answer` to the client!
              },
              orderBy: { questionOrder: "asc" },
            },
          },
        },
        // Direct questions (not in a section)
        questions: {
          where: { sectionId: null },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            content: true,
            explanation: true,
            questionOrder: true,
          },
          orderBy: { questionOrder: "asc" },
        },
      },
    });

    if (!test) throw new Error("Test not found");
    return test;
  }

  public async createTest(data: CreateTestDto) {
    const prisma = databaseService.getClient();

    const newTest = await prisma.test.create({
      data: {
        title: data.title,
        durationInMinutes: data.durationInMinutes,
        totalScore: data.totalScore,
        passingScore: data.passingScore,
        maxAttempts: data.maxAttempts,
        englishTestTypeId: data.englishTestTypeId,
        testSkills: data.testSkills
          ? {
              create: data.testSkills.map((skill) => ({ skill })),
            }
          : undefined,
        sections: {
          create: data.sections.map((section) => ({
            title: section.title,
            skill: section.skill,
            durationInSeconds: section.durationInSeconds,
            questions: {
              create: section.questions.map((q) => ({
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.options,
                content: q.content as any,
                answer: q.answer as any,
                explanation: q.explanation,
                questionOrder: q.questionOrder,
              })),
            },
          })),
        },
      },
      include: {
        sections: { include: { questions: true } },
        testSkills: true,
      },
    });

    return newTest;
  }
}

export const testService = new TestService();
