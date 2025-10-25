import { databaseService } from "@/services/database.service";
import type { Flashcard } from "@/../generated/prisma";

export class FlashcardRepository {
  private prisma = databaseService.getClient();

  public async createFlashcard(flashcardData: {
    frontContent: string;
    backContent: string;
    exampleSentence?: string;
    audioUrl?: string;
    deckId: string;
  }): Promise<Flashcard> {
    return this.prisma.flashcard.create({
      data: flashcardData,
    });
  }
  public async findFlashcardById(id: string): Promise<Flashcard | null> {
    return this.prisma.flashcard.findUnique({
      where: { id: id },
    });
  }
  public async updateFlashcard(
    flashcardData: {
      frontContent: string;
      backContent: string;
      exampleSentence?: string;
      audioUrl?: string;
    },
    flashcardId: string
  ): Promise<Flashcard> {
    return this.prisma.flashcard.update({
      where: {
        id: flashcardId,
      },
      data: flashcardData,
    });
  }
   public async deleteFlashcard(id: string,): Promise<Flashcard> {
      return this.prisma.flashcard.delete({
        where: {
          id: id,
        },
      });
    }
}
