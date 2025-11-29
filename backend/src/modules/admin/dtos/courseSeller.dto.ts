import { z } from "zod";


export const approveCourseSellerApplicationDTO = z.object({
   body: z.object({
    rejectionReason: z.string().optional(),
    message: z.string().optional(),
  }),
  params: z.object({
    applicationId: z.uuid({ error: 'User ID is not correct' }),
    status: z.enum(['APPROVED', 'REJECTED'], { error: 'Status must be either APPROVED or REJECTED' }),
  }),

});



export type ApproveCourseSellerApplicationInput = z.infer<typeof approveCourseSellerApplicationDTO>

