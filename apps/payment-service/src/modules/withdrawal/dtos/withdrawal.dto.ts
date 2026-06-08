// =============================================================================
// Withdrawal DTOs - Data Transfer Objects for Withdrawals
// =============================================================================

import { z } from "zod";

export const requestWithdrawalSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive("Số tiền rút phải lớn hơn 0"),
    bankName: z.string().min(1, "Tên ngân hàng không được để trống"),
    accountName: z.string().min(1, "Tên tài khoản không được để trống"),
    accountNumber: z.string().min(1, "Số tài khoản không được để trống"),
    bankBin: z.string().optional().nullable(),
  }),
});

export const getHistoryQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const cancelWithdrawalSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ (phải là UUID)"),
  }),
});

export const retryWithdrawalSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ (phải là UUID)"),
  }),
  body: z.object({
    amount: z.coerce.number().positive("Số tiền rút phải lớn hơn 0").optional(),
    bankName: z.string().min(1).optional(),
    accountName: z.string().min(1).optional(),
    accountNumber: z.string().min(1).optional(),
    bankBin: z.string().optional().nullable(),
  }),
});

export const getAdminRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  }),
});

export const approveWithdrawalSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ (phải là UUID)"),
  }),
  body: z.object({
    proofImageUrl: z.string().url("URL ảnh biên lai không hợp lệ").or(z.string().length(0)).optional(),
    adminNote: z.string().optional(),
  }),
});

export const rejectWithdrawalSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ (phải là UUID)"),
  }),
  body: z.object({
    adminNote: z.string().min(1, "Lý do từ chối (adminNote) không được để trống"),
  }),
});
