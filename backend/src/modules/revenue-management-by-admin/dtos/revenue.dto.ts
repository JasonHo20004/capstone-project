import { z } from "zod";

export const getRevenueOverviewDTO = z.object({
  query: z
    .object({
      period: z.enum(["today", "week", "month", "quarter", "year"]).optional(),
      startDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Invalid date format, expected YYYY-MM-DD"
        )
        .optional(),
      endDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Invalid date format, expected YYYY-MM-DD"
        )
        .optional(),
      transactionType: z
        .enum(["DEPOSIT", "PAYMENT", "MONTHLYFEE", "WITHDRAW"])
        .optional(),
      limit: z.string().optional(),
      page: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.period && (data.startDate || data.endDate)) {
          throw new Error(
            "Cannot specify both period and date range (startDate/endDate)."
          );
        }
        if (
          (data.startDate && !data.endDate) ||
          (!data.startDate && data.endDate)
        ) {
          throw new Error(
            "Both startDate and endDate must be provided if one is specified."
          );
        }
        return true;
      },
      {
        message: "Invalid query parameters for revenue overview.",
      }
    ),
});

export type GetRevenueOverviewInput = z.infer<typeof getRevenueOverviewDTO>;

export const RevenueOverviewResponseDTO = z.object({
  totalRevenue: z.number(),
  totalTransactions: z.number(),

  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type RevenueOverviewResponse = z.infer<
  typeof RevenueOverviewResponseDTO
>;
