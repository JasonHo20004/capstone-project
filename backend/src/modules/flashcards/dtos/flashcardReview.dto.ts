import { z } from "zod";

// DTO cho API lấy hàng đợi
export const getReviewQueueDTO = z.object({
  params: z.object({
    deckId: z.uuid({
      message: "Deck ID must be a valid UUID",
    }),
  }),
});



export type GetReviewQueueInput = z.infer<typeof getReviewQueueDTO>;