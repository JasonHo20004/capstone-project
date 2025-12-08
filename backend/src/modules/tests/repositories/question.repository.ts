import { databaseService } from "@/services/database.service";
import type { Question } from "@/../generated/prisma";

export class QuestionRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    sectionId: string;
    passageId: string;
    mediaId: string;
    questionText: string;
    questionType: string;
    options?: string[];
    correctAnswerIndex?: number;
    correctAnswer?: string;
    wordLimit?: number;
    imageUrl?: string;
    questionOrder?: number;
  }): Promise<Question> {
    // Validate question type requirements
    if (data.questionType === "MULTIPLE_CHOICE") {
      if (!data.options || data.options.length === 0) {
        throw new Error("Câu hỏi MULTIPLE_CHOICE phải có danh sách lựa chọn");
      }
      if (data.correctAnswerIndex === undefined) {
        throw new Error("Câu hỏi MULTIPLE_CHOICE phải có correctAnswerIndex");
      }
    } else if (data.questionType === "ESSAY") {
      if (!data.wordLimit) {
        throw new Error("Câu hỏi ESSAY phải có giới hạn từ (wordLimit)");
      }
    } else if (data.questionType === "FILL_IN_THE_BLANK") {
      if (!data.correctAnswer) {
        throw new Error("Câu hỏi FILL_IN_THE_BLANK phải có đáp án đúng");
      }
    }

    const createData: any = {
      sectionId: data.sectionId,
      passageId: data.passageId,
      mediaId: data.mediaId,
      questionText: data.questionText,
      questionType: data.questionType as any,
      options: data.options ?? [],
    };

    if (data.correctAnswerIndex !== undefined) {
      createData.correctAnswerIndex = data.correctAnswerIndex;
    }
    if (data.correctAnswer !== undefined) {
      createData.correctAnswer = data.correctAnswer;
    }
    if (data.wordLimit !== undefined) {
      createData.wordLimit = data.wordLimit;
    }
    if (data.imageUrl !== undefined) {
      createData.imageUrl = data.imageUrl;
    }
    if (data.questionOrder !== undefined) {
      createData.questionOrder = data.questionOrder;
    }

    return this.prisma.question.create({
      data: createData,
      include: {
        section: true,
        passage: true,
        mediaAsset: true,
      },
    });
  }

  async findById(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            test: true,
          },
        },
        passage: true,
        mediaAsset: true,
      },
    });
  }

  async findBySectionId(sectionId: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: { sectionId },
      orderBy: {
        questionOrder: "asc",
      },
      include: {
        passage: true,
        mediaAsset: true,
      },
    });
  }

  async findByPassageId(passageId: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: { passageId },
      orderBy: {
        questionOrder: "asc",
      },
      include: {
        section: true,
        mediaAsset: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      questionText?: string;
      questionType?: string;
      options?: string[];
      correctAnswerIndex?: number;
      correctAnswer?: string;
      wordLimit?: number;
      imageUrl?: string;
      questionOrder?: number;
    }
  ): Promise<Question> {
    const updateData: any = {};

    if (data.questionText !== undefined)
      updateData.questionText = data.questionText;
    if (data.questionType !== undefined)
      updateData.questionType = data.questionType as any;
    if (data.options !== undefined) updateData.options = data.options;
    if (data.correctAnswerIndex !== undefined)
      updateData.correctAnswerIndex = data.correctAnswerIndex;
    if (data.correctAnswer !== undefined)
      updateData.correctAnswer = data.correctAnswer;
    if (data.wordLimit !== undefined) updateData.wordLimit = data.wordLimit;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.questionOrder !== undefined)
      updateData.questionOrder = data.questionOrder;

    return this.prisma.question.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({
      where: { id },
    });
  }
}