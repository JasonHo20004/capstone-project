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

    const newFlashcardDeck = await this.flashcardDeckRepository.createDeck(
      userId,
      deckData,
      tagIds
    );

    return newFlashcardDeck;
  }

  public async updateFlashcardDeck(
    id: string,
        title?: string;
        description?: string | null;
        tagIds?: string[];
    },
    userId: string
  ): Promise<FlashcardDeck> {
    
    const updatePayload:any = {};

   if (updateData.title !== undefined) {
        updatePayload.title = updateData.title;
    }

    
    if (updateData.tagIds !== undefined) {
      updatePayload.tagIds = updateData.tagIds
    
    }
    
    updatePayload.description =  updateData.description
    
    const updateFlashcardDeck = await this.flashcardDeckRepository.updateDeck(id,updatePayload,userId)

  
    return updateFlashcardDeck
  }
}
