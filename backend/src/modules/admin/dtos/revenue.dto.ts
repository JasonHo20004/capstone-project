import { z } from 'zod';

export const getRevenueOverviewDTO = z.object({
  query: z.object({
    period: z.enum(['today', 'week', 'month', 'quarter', 'year']).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
  }).refine((data) => {
    if (data.period && (data.startDate || data.endDate)) {
      throw new Error('Cannot specify both period and date range (startDate/endDate).');
    }
    if ((data.startDate && !data.endDate) || (!data.startDate && data.endDate)) {
      throw new Error('Both startDate and endDate must be provided if one is specified.');
    }
    return true;
  }, {
    message: 'Invalid query parameters for revenue overview.',
  }),
});

export type GetRevenueOverviewInput = z.infer<typeof getRevenueOverviewDTO>;

export const RevenueOverviewResponseDTO = z.object({
  totalRevenue: z.number(),
  totalTopupRevenue: z.number(),
  totalSubscriptionRevenue: z.number(),
  totalTransactions: z.number(),
});

export type RevenueOverviewResponse = z.infer<typeof RevenueOverviewResponseDTO>;







export const getRevenueByTransactionTypeDTO = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
    transactionType: z.enum(['DEPOSIT', 'PAYMENT', 'MONTHLYFEE', 'WITHDRAW']).optional(),
  }).refine(data => {
    if (data.startDate && !data.endDate) {
      throw new Error('endDate is required when startDate is provided');
    }
    if (!data.startDate && data.endDate) {
      throw new Error('startDate is required when endDate is provided');
    }
    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error('startDate cannot be after endDate');
    }
    return true;
  }, { message: 'Invalid date range' }),
});

export type GetRevenueByTransactionTypeInput = z.infer<typeof getRevenueByTransactionTypeDTO>;

export const RevenueByTransactionTypeResponseDTO = z.object({
  transactionType: z.string(),
  totalRevenue: z.number(),
  totalTransactionCount: z.number(),
});

export type RevenueByTransactionTypeResponse = z.infer<typeof RevenueByTransactionTypeResponseDTO>;








export const getRevenueByPeriodDTO = z.object({
  query: z.object({
    period: z.enum(['day', 'month', 'year']).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD').optional(),
    limit: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
  }).refine(data => {
    if (data.startDate && !data.endDate) {
      throw new Error('endDate is required when startDate is provided');
    }
    if (!data.startDate && data.endDate) {
      throw new Error('startDate is required when endDate is provided');
    }
    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error('startDate cannot be after endDate');
    }
    return true;
  }, { message: 'Invalid date range' }),
});

export type GetRevenueByPeriodInput = z.infer<typeof getRevenueByPeriodDTO>;

export const RevenueByPeriodResponseDTO = z.object({
  totalRevenue: z.number(),
  topupRevenue: z.number(),
  subscriptionRevenue: z.number(),
  transactionCount: z.number(),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type RevenueByPeriodResponse = z.infer<typeof RevenueByPeriodResponseDTO>;
