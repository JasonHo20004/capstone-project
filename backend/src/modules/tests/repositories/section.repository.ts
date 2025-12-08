import { databaseService } from "@/services/database.service";
import type { Section, Passage  } from "@prisma/client";

export class SectionRepository {
  private prisma = databaseService.getClient();
  async create(data: {
    testId: string;
    title: string;
    skill: string;
    durationInSeconds?: number;
    totalQuestions?: number;
    totalScore?: number;
  }): Promise<Section> {
    const createData: any = {
      testId: data.testId,
      title: data.title,
      skill: data.skill as any,
    };

    if (data.durationInSeconds !== undefined) {
      createData.durationInSeconds = data.durationInSeconds;
    }
    if (data.totalQuestions !== undefined) {
      createData.totalQuestions = data.totalQuestions;
    }
    if (data.totalScore !== undefined) {
      createData.totalScore = data.totalScore;
    }

    return this.prisma.section.create({
      data: createData,
      include: {
        passage: true,
        questions: true,
      },
    });
  }

  async findById(id: string): Promise<Section | null> {
    return this.prisma.section.findUnique({
      where: { id },
      include: {
        passage: {
          orderBy: {
            passageOrder: "asc",
          },
        },
        questions: {
          orderBy: {
            questionOrder: "asc",
          },
          include: {
            mediaAsset: true,
            passage: true,
          },
        },
        test: true,
      },
    });
  }

  async findByTestId(testId: string): Promise<Section[]> {
    return this.prisma.section.findMany({
      where: { testId },
      include: {
        passage: true,
        questions: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      skill?: string;
      durationInSeconds?: number;
      totalQuestions?: number;
      totalScore?: number;
    }
  ): Promise<Section> {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.skill !== undefined) updateData.skill = data.skill as any;
    if (data.durationInSeconds !== undefined)
      updateData.durationInSeconds = data.durationInSeconds;
    if (data.totalQuestions !== undefined)
      updateData.totalQuestions = data.totalQuestions;
    if (data.totalScore !== undefined) updateData.totalScore = data.totalScore;

    return this.prisma.section.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.section.delete({
      where: { id },
    });
  }

  // Passage management
  async addPassage(
    sectionId: string,
    data: {
      content: string;
      passageOrder?: number;
    }
  ): Promise<Passage> {
    const createData: any = {
      sectionId,
      content: data.content,
    };

    if (data.passageOrder !== undefined) {
      createData.passageOrder = data.passageOrder;
    }

    return this.prisma.passage.create({
      data: createData,
    });
  }

  async getPassagesBySectionId(sectionId: string): Promise<Passage[]> {
    return this.prisma.passage.findMany({
      where: { sectionId },
      orderBy: {
        passageOrder: "asc",
      },
    });
  }
  async findSectionByTest(testId: string): Promise<Section[]> {
    return this.prisma.section.findMany({
      where: { testId },
    });
  }
  public async findSectionByIds_InTest(
    testId: string,
    sectionId: string[]
  ): Promise<Section[]> {
    return this.prisma.section.findMany({
      where: {
        testId: testId,
        id: { in: sectionId },
      },
    });
  }


    public async findSectionsInSession(selectedSections: string[]): Promise<any> {
    return this.prisma.section.findMany({
      where: { id: { in:selectedSections } },
        select: {
          skill: true,
          questions: { 
            select: {
              id: true,
              questionType: true,
              correctAnswer: true,
              correctAnswerIndex: true
            }
          }
        }
    });
  }
}
