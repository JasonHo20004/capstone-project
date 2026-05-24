import { z } from "zod";

// Apply for Course Seller
export const applyForSellerSchema = z.object({
  certification: z.array(z.string()).min(1, "At least one certification is required"),
  expertise: z.array(z.string()).min(1, "At least one expertise area is required"),
  message: z.string().optional(),
});

// Update Seller Profile — strictly whitelists `certification` and `expertise`.
// `isActive` is intentionally NOT accepted here: only admin can flip that flag.
export const updateSellerProfileSchema = z
  .object({
    certification: z
      .array(z.string().url("Each certification must be a URL"))
      .min(1, "At least one certification is required")
      .max(20, "Too many certifications")
      .optional(),
    expertise: z
      .array(z.string().trim().min(1).max(100))
      .min(1, "At least one expertise area is required")
      .max(20, "Too many expertise items")
      .optional(),
  })
  .strict();

// Approve/Reject Application (Admin)
export const updateApplicationStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z.string().optional(),
  message: z.string().optional(),
});

// Query applications
export const getApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

// Types
export type ApplyForSellerInput = z.infer<typeof applyForSellerSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type GetApplicationsQuery = z.infer<typeof getApplicationsQuerySchema>;
export type UpdateSellerProfileInput = z.infer<typeof updateSellerProfileSchema>;
