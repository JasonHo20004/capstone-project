import { databaseService } from "@/services/database.service";
import type {
  Flashcard,
  UserFlashcardProgress,
  FlashcardStatus, // Import Enum
} from "@/../generated/prisma";

export class FlashcardReviewRepository {
  private prisma = databaseService.getClient();
  public async findDueCardsByStatus(
    userId: string,
    deckId: string,
    status: FlashcardStatus, // Truyền status (LEARNING hoặc REVIEW)
    limit?: number // Thêm limit (optional)
  ): Promise<(Flashcard & { userProgress: UserFlashcardProgress[] })[]> {
    return this.prisma.flashcard.findMany({
      where: {
        deckId: deckId,
        userProgress: {
          some: {
            userId: userId,
            status: status, 
            nextReviewAt: { lte: new Date() },
          },
        },
      },
      ...(limit!==undefined &&{take: limit}),
      include: {
        userProgress: { where: { userId: userId } },
      },
    });
  }

  public async findNewCards(
    userId: string,
    deckId: string,
    limit: number
  ): Promise<Flashcard[]> {
    return this.prisma.flashcard.findMany({
      where: {
        deckId: deckId,
        userProgress: {
          none: {
            userId: userId,
          },
        },
      },
      take: limit,
    });
  }
}