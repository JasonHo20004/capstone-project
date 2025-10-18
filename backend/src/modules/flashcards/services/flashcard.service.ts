import { FlashcardRepository } from "@/modules/flashcards/repositories/flashcard.repository";
import { FlashcardDeckRepository } from "../repositories/flashcardDeck.repository";
import type { Flashcard } from "@/../generated/prisma";
export class FlashcardService {
  private flashcardRepository = new FlashcardRepository();

  private flashcardDeckRepository= new FlashcardDeckRepository()
  public async createFlashcard(
    userId: string,
    flashcardData:{
        frontContent:string, 
        backContent: string, 
        exampleSentence?:string , 
        audioUrl?:string,
        deckId:string
    }
  ): Promise<Flashcard> {
    const flashcardDeck = await this.flashcardDeckRepository.findFlashcardDeckById(flashcardData.deckId)
    if(!flashcardDeck){
      throw Error("Flashcard Deck is not exitence!")
    }
    if(flashcardDeck.userId !== userId){
       throw Error("Flashcard Deck does not belong to User!")
    }

    const newFlashcard = await this.flashcardRepository.createFlashcard(
      flashcardData
    );

    return newFlashcard;
  }
}
