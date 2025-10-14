import type { Request, Response } from 'express';
import { FlashcardDeckService } from '@/modules/flashcards/services/flashcardDeck.service';
import type {CreateFlashcardDeckInput } from '@/modules/flashcards/dtos/flashcardDeck.dto';
import type { AuthenticatedRequest } from '@/middlewares/auth.middleware';



export class FlashcardDeckController {
  private flashcardDeckService = new FlashcardDeckService();  

  public createFlashcardDeck= async(req: AuthenticatedRequest&{body: CreateFlashcardDeckInput['body']}, res: Response):Promise<void> =>{
    try {
      const userId = req.user!.userId
      const flashcardDeckData = req.body;
      const newFlashcardDeck = await this.flashcardDeckService.createFlashcardDeck(userId,flashcardDeckData);
      
      res.status(200).json({
        success: true,
        message: 'Create flashcard deck successfully',
        data: newFlashcardDeck,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create flashcard deck',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

};