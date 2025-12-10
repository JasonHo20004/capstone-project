import { z } from "zod";

export const getRevenueOverviewDTO = z.object({
  query: z
    .object({
      period: z.enum(["today", "week", "month", "quarter", "year"]).optional(),
      startDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Định dạng ngày không hợp lệ, yêu cầu YYYY-MM-DD"
        )
        .optional(),
      endDate: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Định dạng ngày không hợp lệ, yêu cầu YYYY-MM-DD"
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
            "Không thể đồng thời chỉ định kỳ và khoảng thời gian (startDate/endDate)."
          );
        }
        if (
          (data.startDate && !data.endDate) ||
          (!data.startDate && data.endDate)
        ) {
          throw new Error(
            "Phải cung cấp cả startDate và endDate nếu đã chỉ định một trong hai."
          );
        }
        return true;
      },
      {
        message: "Tham số truy vấn không hợp lệ cho tổng quan doanh thu.",
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