import type { Response } from "express";
import { FlashcardService } from "@/modules/flashcards/services/flashcard.service";
import type {
  CreateFlashcardInput,
  UpdateFlashcardInput,
  DeleteFlashcardInput,
  GetAllFlashcardInput,
} from "@/modules/flashcards/dtos/flashcard.dto";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class FlashcardController {
  private flashcardService = new FlashcardService();

  public getAllFlashcard = async (
    req: AuthenticatedRequest & { params: GetAllFlashcardInput["params"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const {deckId} = req.params
      const flashcards = await this.flashcardService.getAllFlashcards(userId,deckId);

      res.status(200).json({
        success: true,
        message: "Lấy tất cả flashcard thành công",
        data: flashcards,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy tất cả flashcard thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public createFlashcard = async (
    req: AuthenticatedRequest & { body: CreateFlashcardInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { frontContent, backContent, exampleSentence, deckId } = req.body;
      const newFlashcard = await this.flashcardService.createFlashcard(userId, {
        frontContent,
        backContent,
        exampleSentence,
        deckId,
      });

      res.status(200).json({
        success: true,
        message: "Tạo flashcard thành công",
        data: newFlashcard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy tất cả flashcard thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public updateFlashcard = async (
    req: AuthenticatedRequest & {
      params: UpdateFlashcardInput["params"];
      body: UpdateFlashcardInput["body"];
    },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { flashcardId } = req.params;
      const { frontContent, backContent, exampleSentence } = req.body;
      const updatedFlashcard = await this.flashcardService.updateFlashcard(
        userId,
        {
          frontContent,
          backContent,
          exampleSentence,
        },
        flashcardId!
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật flashcard thành công",
        data: updatedFlashcard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Cập nhật flashcard thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public deleteFlashcard = async (
    req: AuthenticatedRequest & {
      params: DeleteFlashcardInput["params"];
    },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { flashcardId } = req.params;

      await this.flashcardService.deleteFlashcard(flashcardId!, userId);

      res.status(200).json({
        success: true,
        message: "Xóa flashcard thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Xóa flashcard thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
