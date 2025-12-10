import { z } from "zod";


export const approveCourseSellerApplicationDTO = z.object({
   body: z.object({
    rejectionReason: z.string().optional(),
    message: z.string().optional(),
  }),
  params: z.object({
    applicationId: z.uuid({ error: 'ID người dùng không đúng' }),
    status: z.enum(['APPROVED', 'REJECTED'], { error: 'Trạng thái phải là APPROVED hoặc REJECTED' }),
  }),

});



export type ApproveCourseSellerApplicationInput = z.infer<typeof approveCourseSellerApplicationDTO>

