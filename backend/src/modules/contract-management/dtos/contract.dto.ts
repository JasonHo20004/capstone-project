import { z } from "zod";

export const createContractDTO = z.object({
  body: z.object({
    courseSellerId: z.uuid({ message: 'ID người bán khóa học phải là UUID hợp lệ' }),
    notes: z.string().optional()
  })
});

export type CreateContractInput = z.infer<typeof createContractDTO>;

export const renewContractDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'ID hợp đồng phải là UUID hợp lệ' })
  }),
  body: z.object({
    notes: z.string().optional()
  })
});

export type RenewContractInput = z.infer<typeof renewContractDTO>;

export const updateContractStatusDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'ID hợp đồng phải là UUID hợp lệ' })
  }),
  body: z.object({
    status: z.boolean({ message: 'Trạng thái phải là giá trị boolean' }),
    notes: z.string().optional()
  })
});

export type UpdateContractStatusInput = z.infer<typeof updateContractStatusDTO>;

export const sendNotificationDTO = z.object({
  body: z.object({
    contractIds: z.array(z.uuid()).min(1, 'Cần ít nhất một ID hợp đồng'),
    notificationType: z.enum(['RENEWAL_REMINDER', 'EXPIRATION_WARNING', 'FINAL_NOTICE'], {
      error: 'Loại thông báo phải là RENEWAL_REMINDER, EXPIRATION_WARNING, hoặc FINAL_NOTICE'
    })
  })
});

export type SendNotificationInput = z.infer<typeof sendNotificationDTO>;

export const getContractHistoryDTO = z.object({
  params: z.object({
    sellerId: z.uuid({ message: 'ID người bán phải là UUID hợp lệ' })
  })
});

export type GetContractHistoryInput = z.infer<typeof getContractHistoryDTO>;

export const lockSellerDTO = z.object({
  params: z.object({
    contractId: z.uuid({ message: 'ID hợp đồng phải là UUID hợp lệ' })
  })
});

export type LockSellerInput = z.infer<typeof lockSellerDTO>;