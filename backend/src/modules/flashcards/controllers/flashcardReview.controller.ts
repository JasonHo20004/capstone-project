import type { Response } from "express";
import { FlashcardReviewService } from "@/modules/flashcards/services/flashcardReview.service";
import type { GetReviewQueueInput } from "@/modules/flashcards/dtos/flashcardReview.dto";
import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export class FlashcardReviewController {
  private reviewService = new FlashcardReviewService();

  public getReviewQueue = async (
    req: AuthenticatedRequest & { params: GetReviewQueueInput["params"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { deckId } = req.params;

      const queue = await this.reviewService.getReviewQueue(userId, deckId);

      res.status(200).json({
        success: true,
        message: "Fetched review queue successfully",
        data: queue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch review queue",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };


}