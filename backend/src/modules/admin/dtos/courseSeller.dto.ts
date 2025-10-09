import { z } from "zod";


export const approveCourseSellerApplicationDTO = z.object({
   body: z.object({
    rejectionReason: z.string().nonempty().optional(),
    message: z.string().nullable().optional(),
  }),
  params: z.object({
    userId: z.uuid({ error: 'User ID is not correct' }),
    status: z.enum(['APPROVED', 'REJECTED'], { error: 'Status must be either APPROVED or REJECTED' }),
  }),

});



export type ApproveCourseSellerApplicationInput = z.infer<typeof approveCourseSellerApplicationDTO>

