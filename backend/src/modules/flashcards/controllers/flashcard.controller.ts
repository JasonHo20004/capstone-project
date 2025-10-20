import type { Response } from "express";
import { FlashcardService } from "@/modules/flashcards/services/flashcard.service";
import type {
  CreateFlashcardInput,
  UpdateFlashcardInput,
  DeleteFlashcardInput,
} from "@/modules/flashcards/dtos/flashcard.dto";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class FlashcardController {
  private flashcardService = new FlashcardService();

  public createFlashcard = async (
    req: AuthenticatedRequest & { body: CreateFlashcardInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { frontContent, backContent, exampleSentence, audioUrl, deckId } =
        req.body;
      const newFlashcard = await this.flashcardService.createFlashcard(userId, {
        frontContent,
        backContent,
        exampleSentence,
        audioUrl,
        deckId,
      });

      res.status(200).json({
        success: true,
        message: "Create flashcard  successfully",
        data: newFlashcard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create flashcard deck",
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
      const { frontContent, backContent, exampleSentence, audioUrl } = req.body;
      const updatedFlashcard = await this.flashcardService.updateFlashcard(
        userId,
        {
          frontContent,
          backContent,
          exampleSentence,
          audioUrl,
        },
        flashcardId!
      );

      res.status(200).json({
        success: true,
        message: "Update flashcard deck successfully",
        data: updatedFlashcard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update flashcard deck",
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

      await this.flashcardService.deleteFlashcard(
        flashcardId!,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Delete flashcard successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete flashcard ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
