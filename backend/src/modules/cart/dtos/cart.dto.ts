import { z } from "zod";

// Request
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

// Response 

const CartItemUserSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
});

const CartItemCartSchema = z.object({
  user: CartItemUserSchema.nullable(),
});


const CartItemCourseSchema = z.object({
  title: z.string(),
});


export const CreateCartItemResponseSchema = z.object({
  id: z.uuid(),
  cartId: z.uuid(),
  courseId: z.uuid(),
  priceAtTime: z.number(), 
  addedAt: z.date(), 

  course: CartItemCourseSchema,
  cart: CartItemCartSchema,
});

export type CreateCartItemResponseDTO = z.infer<typeof CreateCartItemResponseSchema>;