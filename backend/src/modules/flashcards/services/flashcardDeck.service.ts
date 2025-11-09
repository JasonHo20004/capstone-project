import { FlashcardDeckRepository } from "@/modules/flashcards/repositories/flashcardDeck.repository";
import type { CreateFlashcardDeckInput } from "@/modules/flashcards/dtos/flashcardDeck.dto";
import type { FlashcardDeck } from "@/../generated/prisma";
import {TagRepository} from '@/modules/flashcards/repositories/tag.repository'
export class FlashcardDeckService {
  private flashcardDeckRepository = new FlashcardDeckRepository();
  private tagRepository = new TagRepository()
  public async createFlashcardDeck(
    userId: string,
    flashcardDeckData: CreateFlashcardDeckInput["body"]
  ): Promise<FlashcardDeck> {
    const { tagIds, ...deckData } = flashcardDeckData;

     tagIds.map(async (tagId)=>{
      const existingTag = await this.tagRepository.findTagById(tagId)
      if(!existingTag){
        throw Error("Tag is not existence")
      }
    })
    const newFlashcardDeck = await this.flashcardDeckRepository.createDeck(
      userId,
      deckData,
      tagIds
    );

    return newFlashcardDeck;
  }

  public async updateFlashcardDeck(
    id: string,
    updateData: {
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
    updatePayload.tagIds.map(async (tagId:string)=>{
      const existingTag = await this.tagRepository.findTagById(tagId)
      if(existingTag){
        throw Error("Tag is not existence")
      }
    })
    
    updatePayload.description =  updateData.description
    
    const updateFlashcardDeck = await this.flashcardDeckRepository.updateDeck(id,updatePayload,userId)

  
    return updateFlashcardDeck
  }
public async deleteFlashcardDeck(id: string, userId: string): Promise<void> {
  try {
    await this.flashcardDeckRepository.deleteDeck(id, userId);
  } catch (error:any) { 
      if (error.code === 'P2025') {
        throw new Error('Flashcard deck not found or user does not have permission.');
      }
    throw error;
  }
}
}
