import type { Response } from "express";
import { FlashcardReviewService } from "@/modules/flashcards/services/flashcardReview.service";
import type { GetReviewQueueInput, SubmitReviewInput } from "@/modules/flashcards/dtos/flashcardReview.dto";
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
        message: "Lấy hàng đợi bài kiểm tra thành công",
        data: queue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy hàng đợi bài kiểm tra thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
public submitReview = async (
    req: AuthenticatedRequest & {
      params: SubmitReviewInput["params"];
      body: SubmitReviewInput["body"];
    },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { flashcardId } = req.params;
      const { quality } = req.body;

      const updatedProgress = await this.reviewService.submitReview(
        userId,
        flashcardId,
        quality
      );

      res.status(200).json({
        success: true,
        message: "Gửi bài kiểm tra thành công",
        data: updatedProgress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gửi bài kiểm tra thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

}