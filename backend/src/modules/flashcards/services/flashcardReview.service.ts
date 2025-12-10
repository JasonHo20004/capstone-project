import { FlashcardReviewRepository } from "@/modules/flashcards/repositories/flashcardReview.repository";
import type {  UserFlashcardProgress } from "@prisma/client";

const NEW_CARDS_PER_DAY = 20;
const REVIEW_CARDS_MAX = 100;
const LEARNING_STEPS_MINUTES = [1, 10];

function addTime(date: Date, amount: number, unit: "minute" | "day"): Date {
  const newDate = new Date(date);
  if (unit === "minute") {
    newDate.setMinutes(newDate.getMinutes() + amount);
  } else if (unit === "day") {
    newDate.setDate(newDate.getDate() + amount);
  }
  return newDate;
}
export class FlashcardReviewService {
  private reviewFlashcardRepository = new FlashcardReviewRepository();

  public async getReviewQueue(
    userId: string,
    deckId: string
  ): Promise<any[]> {
    const learningCards =
      await this.reviewFlashcardRepository.findDueCardsByStatus(
        userId,
        deckId,
        "LEARNING"
      );

    const reviewCards =
      await this.reviewFlashcardRepository.findDueCardsByStatus(
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
    const learningWithTag = learningCards.map((c) => ({
      ...c,
      queueType: "LEARNING",
    }));
    const reviewWithTag = reviewCards.map((c) => ({
      ...c,
      queueType: "REVIEW",
    }));
    const newWithTag = newCards.map((c) => ({ ...c, queueType: "NEW" }));
    const shuffledLearning = learningWithTag.sort(() => Math.random() - 0.5);
    const shuffledReview = reviewWithTag.sort(() => Math.random() - 0.5);
    const shuffledNew = newWithTag.sort(() => Math.random() - 0.5);

    const queue = [...shuffledLearning, ...shuffledReview, ...shuffledNew];

    return queue;
  }

  public async submitReview(
    userId: string,
    flashcardId: string,
    quality: 1 | 3 | 4 | 5
  ): Promise<UserFlashcardProgress> {
    // Step 1: Get or create progress (transitions NEW cards to LEARNING)
    let progress = await this.reviewFlashcardRepository.upsertProgress(
      userId,
      flashcardId
    );

    const now = new Date();

    // --- Algorithm Logic ---

    if (progress.status === "LEARNING") {
      // --- Card is in LEARNING state (short steps) ---

      if (quality < 3) {
        // "Again" pressed: Reset to the first learning step
        progress.learningStep = 0;
        progress.nextReviewAt = addTime(
          now,
          LEARNING_STEPS_MINUTES[0]!,
          "minute"
        );
      } else {
        // "Hard", "Good", or "Easy" pressed: Advance step or graduate
        const currentStep = progress.learningStep;

        if (currentStep < LEARNING_STEPS_MINUTES.length - 1) {
          // Still in learning steps: Advance to the next step
          progress.learningStep++;
          const nextDuration = LEARNING_STEPS_MINUTES[progress.learningStep];
          progress.nextReviewAt = addTime(now, nextDuration!, "minute");
        } else {
          // Last learning step completed: Graduate -> Move to REVIEW status
          progress.status = "REVIEW";
          progress.repetitions = 1;
          progress.interval = quality === 5 ? 4 : 1; // Easy: 4 days, Good/Hard: 1 day
          progress.nextReviewAt = addTime(now, progress.interval, "day");
        }
      }
    } else {
      // --- Card is in REVIEW state (long-term intervals) ---

      if (quality < 3) {
        // "Again" pressed: Card lapsed -> Reset to LEARNING
        progress.status = "LEARNING";
        progress.learningStep = 0;
        progress.repetitions = 0;
        progress.interval = 0;
        progress.easeFactor = Math.max(1.3, progress.easeFactor - 0.2); // Reduce EF
        progress.nextReviewAt = addTime(
          now,
          LEARNING_STEPS_MINUTES[0]!,
          "minute"
        );
      } else {
        // "Hard", "Good", or "Easy" pressed: Calculate SM-2 logic

        // Update EaseFactor
        const q = quality as number;
        progress.easeFactor = Math.max(
          1.3,
          progress.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        );

        // Update Interval
        if (progress.repetitions === 0) {
          progress.interval = 1;
        } else if (progress.repetitions === 1) {
          progress.interval = 6;
        } else {
          progress.interval = Math.round(
            progress.interval * progress.easeFactor
          );
        }

        progress.repetitions++;

        // "Hard" (quality=3) might slightly modify the interval
        if (quality === 3) {
          progress.interval = Math.round(progress.interval * 1.2); // Increase a little less
        }

        progress.nextReviewAt = addTime(now, progress.interval, "day");
      }
    }

    // Step 3: Update the DB
    const updatedProgress = await this.reviewFlashcardRepository.updateProgress(
      userId,
      flashcardId,
      progress
    );

    return updatedProgress;
  }
}
