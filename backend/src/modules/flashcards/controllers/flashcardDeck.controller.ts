import type {  Response } from 'express';
import { FlashcardDeckService } from '@/modules/flashcards/services/flashcardDeck.service';
import type {CreateFlashcardDeckInput, UpdateFlashcardDeckInput, DeleteFlashcardDeckInput } from '@/modules/flashcards/dtos/flashcardDeck.dto';
import type { AuthenticatedRequest } from '@/middlewares/auth.middleware';



export class FlashcardDeckController {
  private flashcardDeckService = new FlashcardDeckService();  

  public getAllFlashcardDeck = async (req:AuthenticatedRequest,res:Response):Promise<void>=>{
    try {
      const userId = req.user!.userId
     
      const flashcardDecks = await this.flashcardDeckService.getFlashcardDecks(userId);
      
      res.status(200).json({
        success: true,
        message: 'Lấy tất cả flashcard deck thành công',
        data: flashcardDecks,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lấy tất cả flashcard deck thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  public createFlashcardDeck= async(req: AuthenticatedRequest&{body: CreateFlashcardDeckInput['body']}, res: Response):Promise<void> =>{
    try {
      const userId = req.user!.userId
      const flashcardDeckData = req.body;
      const newFlashcardDeck = await this.flashcardDeckService.createFlashcardDeck(userId,flashcardDeckData);
      
      res.status(200).json({
        success: true,
        message: 'Tạo flashcard deck thành công',
        data: newFlashcardDeck,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Tạo flashcard deck thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  public updateFlashcardDeck= async(req: AuthenticatedRequest&{params:UpdateFlashcardDeckInput['params'] ,body: UpdateFlashcardDeckInput['body']}, res: Response):Promise<void> =>{
    try {
      const userId = req.user!.userId
      const {flashcardDeckId} = req.params
      const {title,description,tagIds} = req.body; 
      const updatedFlashcardDeck = await this.flashcardDeckService.updateFlashcardDeck(flashcardDeckId!,{title,description, tagIds},userId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật flashcard deck thành công',
        data: updatedFlashcardDeck,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Cập nhật flashcard deck thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  public deleteFlashcardDeck= async(req: AuthenticatedRequest&{params:DeleteFlashcardDeckInput['params'] }, res: Response):Promise<void> =>{
    try {
      const userId = req.user!.userId
      const {flashcardDeckId} = req.params

     await this.flashcardDeckService.deleteFlashcardDeck(flashcardDeckId!, userId);
      
      res.status(200).json({
        success: true,
        message: 'Xóa flashcard deck thành công',
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Xóa flashcard deck thất bại',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

};