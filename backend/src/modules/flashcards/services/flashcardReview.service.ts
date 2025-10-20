import { FlashcardReviewRepository } from "@/modules/flashcards/repositories/flashcardReview.repository";
import type { Flashcard } from "@/../generated/prisma";

const NEW_CARDS_PER_DAY = 20;
const REVIEW_CARDS_MAX = 100;

export class FlashcardReviewService {
  private reviewFlashcardRepository = new FlashcardReviewRepository();

  public async getReviewQueue(
    userId: string,
    deckId: string
  ): Promise<Flashcard[]> {

    const learningCards = await this.reviewFlashcardRepository.findDueCardsByStatus(
      userId,
      deckId,
      "LEARNING"
    );

    const reviewCards = await this.reviewFlashcardRepository.findDueCardsByStatus(
      userId,
      deckId,
      "REVIEW",
      REVIEW_CARDS_MAX
    );

    const newCards = await this.reviewFlashcardRepository.findNewCards(
      userId,
      deckId,
      NEW_CARDS_PER_DAY
    );

    const shuffledLearning = learningCards.sort(() => Math.random() - 0.5);
    const shuffledReview = reviewCards.sort(() => Math.random() - 0.5);
    const shuffledNew = newCards.sort(() => Math.random() - 0.5);

    const queue = [...shuffledLearning, ...shuffledReview, ...shuffledNew];

    return queue;
  }
}
