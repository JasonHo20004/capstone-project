import { databaseService } from "../../services/database.service.js";
import { CreateTestDto } from "./test.schema.js";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export class TestService {

  public async getAllTests(status?: string) {
    const prisma = databaseService.getClient();
    return await prisma.test.findMany({
      where: status ? { status } : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
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

  public async getTestById(idOrSlug: string) {
    const prisma = databaseService.getClient();
    const where = isUUID(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug };
    const test = await prisma.test.findFirst({
      where,
      include: {
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        sections: {
          orderBy: { orderIndex: "asc" as const },
          include: {
            passages: {
              orderBy: { passageOrder: "asc" as const },
            },
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
    const slug = generateSlug(data.title);

    const newTest = await prisma.test.create({
      data: {
        title: data.title,
        slug,
        status: (data as any).status || "DRAFT",
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
          create: data.sections.map((section, idx) => ({
            title: section.title,
            skill: section.skill,
            durationInSeconds: section.durationInSeconds,
            orderIndex: idx,
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
