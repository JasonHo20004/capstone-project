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
export const partialCheckoutDTO = z.object({
  body: z.object({
    cartItemIds: z.array(z.uuid("Invalid cart Item ID format")).nonempty({ message: "You must select at least cart Item Id " }),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartDTO>;
export type DirectBuyInput = z.infer<typeof directBuyDTO>
export type PartialCheckoutInput = z.infer<typeof partialCheckoutDTO>