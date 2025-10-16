import { z } from "zod";

// Create Contract DTO
export const createContractDTO = z.object({
  body: z.object({
    courseSellerId: z.uuid({ message: 'Course Seller ID must be a valid UUID' }),
    notes: z.string().optional()
  })
});

export type CreateContractInput = z.infer<typeof createContractDTO>;

export const renewContractDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'Contract ID must be a valid UUID' })
  }),
  body: z.object({
    notes: z.string().optional()
  })
});

export type RenewContractInput = z.infer<typeof renewContractDTO>;

export const updateContractStatusDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'Contract ID must be a valid UUID' })
  }),
  body: z.object({
    status: z.boolean({ message: 'Status must be a boolean value' }),
    notes: z.string().optional()
  })
});

export type UpdateContractStatusInput = z.infer<typeof updateContractStatusDTO>;

export const sendNotificationDTO = z.object({
  body: z.object({
    contractIds: z.array(z.uuid()).min(1, 'At least one contract ID is required'),
    notificationType: z.enum(['RENEWAL_REMINDER', 'EXPIRATION_WARNING', 'FINAL_NOTICE'], {
      error: 'Notification type must be RENEWAL_REMINDER, EXPIRATION_WARNING, or FINAL_NOTICE'
    })
  })
});

export type SendNotificationInput = z.infer<typeof sendNotificationDTO>;

export const getContractHistoryDTO = z.object({
  params: z.object({
    sellerId: z.uuid({ message: 'Seller ID must be a valid UUID' })
  })
});

export type GetContractHistoryInput = z.infer<typeof getContractHistoryDTO>;

// Lock Seller DTO
export const lockSellerDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'Contract ID must be a valid UUID' })
  })
});

export type LockSellerInput = z.infer<typeof lockSellerDTO>;
