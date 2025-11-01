import { z } from "zod";

// Response
const OrderCourseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
});
const OrderCartItemSchema = z.object({
  id: z.uuid(),
  priceAtTime: z.number(), 
  course: OrderCourseSchema,
});

const OrderCartSchema = z.object({
  cartItems: z.array(OrderCartItemSchema),
});

const OrderUserSchema = z.object({
  fullName: z.string(),
  email: z.email(),
});


export const CreateOrderResponseSchema = z.object({
 
  id: z.uuid(),
  userId: z.uuid(),
  cartId: z.uuid(),
  totalAmount: z.number(), 
  createdAt: z.date(),
  transactionId: z.string().nullable(), 
  user: OrderUserSchema,
  cart: OrderCartSchema,
});


export type CreateOrderResponseDTO = z.infer<typeof CreateOrderResponseSchema>;