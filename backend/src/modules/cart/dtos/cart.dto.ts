import { z } from "zod";

export const addToCartDTO = z.object({
  body: z.object({
    courseId:z.uuid("Invalid Course ID format")
  }),
});
export const directBuyDTO = z.object({
  body: z.object({
    courseId:z.uuid("Invalid Course ID format")
  }),
});

export type AddToCartInput = z.infer<typeof addToCartDTO>;
export type DirectBuyInput = z.infer<typeof directBuyDTO>
