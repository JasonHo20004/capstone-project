// =============================================================================
// Order DTOs - Data Transfer Objects for Orders
// =============================================================================

import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    cartId: z.string().uuid("ID giỏ hàng không hợp lệ (phải là UUID)"),
  }),
});

export const payOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID đơn hàng không hợp lệ (phải là UUID)"),
  }),
});

export const getHistoryQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type PayOrderParams = z.infer<typeof payOrderSchema>["params"];
export type GetHistoryQuery = z.infer<typeof getHistoryQuerySchema>["query"];
