import { FlashcardRepository } from "@/modules/flashcards/repositories/flashcard.repository";
import { FlashcardDeckRepository } from "../repositories/flashcardDeck.repository";
import type { Flashcard } from "@/../generated/prisma";
export class FlashcardService {
  private flashcardRepository = new FlashcardRepository();

  private flashcardDeckRepository = new FlashcardDeckRepository();
  public async createFlashcard(
    userId: string,
    flashcardData: {
      frontContent: string;
      backContent: string;
      exampleSentence?: string;
      audioUrl?: string;
      deckId: string;
    }
  ): Promise<Flashcard> {
    const flashcardDeck =
      await this.flashcardDeckRepository.findFlashcardDeckById(
        flashcardData.deckId
      );
    if (!flashcardDeck) {
      throw Error("Flashcard Deck is not exitence!");
    }
    if (flashcardDeck.userId !== userId) {
      throw Error("Flashcard Deck does not belong to User!");
    }

    const newFlashcard = await this.flashcardRepository.createFlashcard(
      flashcardData
    );

    return newFlashcard;
  }
  public async updateFlashcard(
    userId: string,
    flashcardData: {
      frontContent: string;
      backContent: string;
      exampleSentence?: string;
      audioUrl?: string;
    },
    flashcardId: string
  ): Promise<Flashcard> {
    const flashcard = await this.flashcardRepository.findFlashcardById(
      flashcardId
    );
    if (!flashcard) {
      throw Error("Flashcard is not exitence!");
    }
    const flashcardDeck = await this.flashcardDeckRepository.findFlashcardDeckById(flashcard.deckId)
    if(flashcardDeck?.userId !==userId ){
      throw Error("Flashcard does not belong to user!");
    }

    const updateFlashcard = await this.flashcardRepository.updateFlashcard(flashcardData, flashcardId)
    return updateFlashcard
  }
  public async deleteFlashcard(id: string, userId: string): Promise<void> {
  try {
     const flashcard = await this.flashcardRepository.findFlashcardById(
      id
    );
    if (!flashcard) {
      throw Error("Flashcard is not exitence!");
    }
    const flashcardDeck = await this.flashcardDeckRepository.findFlashcardDeckById(flashcard.deckId)
    if(flashcardDeck?.userId !==userId ){
      throw Error("Flashcard does not belong to user!");
    }

    await this.flashcardRepository.deleteFlashcard(id);
  } catch (error:any) { 
      if (error.code === 'P2025') {
        throw new Error('Flashcard deck not found or user does not have permission.');
      }
    throw error;
  }
}
}
