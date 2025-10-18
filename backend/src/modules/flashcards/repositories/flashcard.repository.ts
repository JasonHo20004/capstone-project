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
      data: flashcardData
    });
  }
}
