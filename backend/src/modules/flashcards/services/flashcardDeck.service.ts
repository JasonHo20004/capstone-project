import { FlashcardDeckRepository } from "@/modules/flashcards/repositories/flashcardDeck.repository";
import type { CreateFlashcardDeckInput } from "@/modules/flashcards/dtos/flashcardDeck.dto";
import type { FlashcardDeck } from "@/../generated/prisma";

export class FlashcardDeckService {
  private flashcardDeckRepository = new FlashcardDeckRepository();

  public async createFlashcardDeck(
    userId: string,
    flashcardDeckData: CreateFlashcardDeckInput["body"]
  ): Promise<FlashcardDeck> {
    const { tagIds, ...deckData } = flashcardDeckData;

    // A single, clean call to our new repository method.
    const newFlashcardDeck = await this.flashcardDeckRepository.createDeck(
      userId,
      deckData,
      tagIds
    );

    return newFlashcardDeck;
  }
}
