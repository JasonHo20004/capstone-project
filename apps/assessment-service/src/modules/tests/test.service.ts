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

  public async getTestTypes() {
    const prisma = databaseService.getClient();
    return await prisma.englishTestType.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
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
            mediaUrl: (section as any).mediaUrl || undefined,
            imageUrl: (section as any).imageUrl || undefined,
            orderIndex: idx,
            passages: (section as any).passageContent
              ? {
                  create: [{
                    content: (section as any).passageContent,
                    passageOrder: 1,
                  }],
                }
              : undefined,
            questions: {
              create: section.questions.map((q) => ({
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.options,
                content: q.content as any,
                answer: q.answer as any,
                explanation: q.explanation,
                questionOrder: q.questionOrder,
                imageUrl: (q as any).imageUrl || undefined,
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

  public async updateTest(id: string, data: {
    title?: string;
    durationInMinutes?: number;
    status?: string;
    totalScore?: number;
    passingScore?: number;
    maxAttempts?: number;
    englishTestTypeId?: string;
    testSkills?: Array<"READING" | "LISTENING" | "WRITING" | "SPEAKING">;
    sections?: Array<{
      title: string;
      skill?: string;
      durationInSeconds?: number;
      mediaUrl?: string;
      imageUrl?: string;
      passageContent?: string;
      questions: Array<{
        questionText?: string;
        questionType: string;
        options?: string[];
        content?: any;
        answer?: any;
        explanation?: string;
        questionOrder?: number;
        imageUrl?: string;
      }>;
    }>;
  }) {
    const prisma = databaseService.getClient();
    const { testSkills, sections, ...testData } = data;

    // Update slug if title changes
    if (testData.title) {
      (testData as any).slug = generateSlug(testData.title);
    }

    // If sections are provided, delete old sections and recreate
    if (sections && sections.length > 0) {
      // Delete existing sections (cascade deletes questions)
      await prisma.section.deleteMany({ where: { testId: id } });
      // Also delete direct questions (not in sections)
      await prisma.question.deleteMany({ where: { testId: id } });
    }

    const updated = await prisma.test.update({
      where: { id },
      data: {
        ...testData,
        ...(testSkills
          ? {
              testSkills: {
                deleteMany: {},
                create: testSkills.map((skill) => ({ skill })),
              },
            }
          : {}),
        ...(sections && sections.length > 0
          ? {
              sections: {
                create: sections.map((section, idx) => ({
                  title: section.title,
                  skill: section.skill as any,
                  durationInSeconds: section.durationInSeconds,
                  mediaUrl: section.mediaUrl || undefined,
                  imageUrl: section.imageUrl || undefined,
                  orderIndex: idx,
                  passages: section.passageContent
                    ? {
                        create: [{
                          content: section.passageContent,
                          passageOrder: 1,
                        }],
                      }
                    : undefined,
                  questions: {
                    create: section.questions.map((q) => ({
                      questionText: q.questionText,
                      questionType: q.questionType as any,
                      options: q.options || [],
                      content: q.content as any,
                      answer: q.answer as any,
                      explanation: q.explanation,
                      questionOrder: q.questionOrder,
                      imageUrl: q.imageUrl || undefined,
                    })),
                  },
                })),
              },
            }
          : {}),
      },
      include: {
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        sections: { include: { questions: true } },
      },
    });

    return updated;
  }

  public async deleteTest(id: string) {
    const prisma = databaseService.getClient();
    await prisma.test.delete({ where: { id } });
    return { deleted: true };
  }

  public async gradeTest(testId: string, submissions: Record<string, string>) {
    const prisma = databaseService.getClient();

    // Fetch all questions with their answers (server-side only)
    const questions = await prisma.question.findMany({
      where: { testId },
      select: {
        id: true,
        questionText: true,
        questionType: true,
        content: true,
        answer: true,
        explanation: true,
        questionOrder: true,
      },
      orderBy: { questionOrder: "asc" },
    });

    if (questions.length === 0) throw new Error("No questions found for this test.");

    let correct = 0;
    const details = questions.map((q) => {
      const userAnswer = (submissions[q.id] || "").trim();
      const answerData = q.answer as any;
      const contentData = q.content as any;
      let correctAnswer = "";
      let isCorrect = false;

      if (q.questionType === "MULTIPLE_CHOICE") {
        const options = contentData?.options || [];
        const correctIndex = answerData?.correctIndex;
        correctAnswer = options[correctIndex] || `Option ${correctIndex}`;
        isCorrect = userAnswer === correctAnswer;
      } else if (q.questionType === "GAP_FILL") {
        const acceptedAnswers: string[] = answerData?.text || [];
        correctAnswer = acceptedAnswers[0] || "";
        isCorrect = acceptedAnswers.some(
          (a: string) => a.toLowerCase().trim() === userAnswer.toLowerCase()
        );
      } else if (q.questionType === "TRUE_FALSE_NOT_GIVEN") {
        correctAnswer = answerData?.correctAnswer || "";
        isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
      } else if (q.questionType === "MATCHING") {
        correctAnswer = answerData?.text?.[0] || answerData?.correctAnswer || "";
        isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      }

      if (isCorrect) correct++;

      return {
        questionId: q.id,
        questionOrder: q.questionOrder,
        questionText: contentData?.text || q.questionText || "",
        questionType: q.questionType,
        userAnswer: userAnswer || "(no answer)",
        correctAnswer,
        isCorrect,
        explanation: q.explanation || null,
      };
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      score: { correct, total, percentage },
      details,
    };
  }
}

export const testService = new TestService();
