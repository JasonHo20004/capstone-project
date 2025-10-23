import { z } from "zod";

// DTO cho API lấy hàng đợi
export const getReviewQueueDTO = z.object({
  params: z.object({
    deckId: z.uuid({
      message: "Deck ID must be a valid UUID",
    }),
  }),
});
export const submitReviewDTO = z.object({
  params: z.object({
    flashcardId: z.uuid({
      message: "Flashcard ID must be a valid UUID",
    }),
  }),
  body: z.object({
    // 1: Again, 3: Hard, 4: Good, 5: Easy
    quality: z.union([
      z.literal(1),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
  }),
});


export type GetReviewQueueInput = z.infer<typeof getReviewQueueDTO>;
export type SubmitReviewInput = z.infer<typeof submitReviewDTO>;