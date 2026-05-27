// =============================================================================
// User DTOs - Data Transfer Objects for Users
// =============================================================================

import { z } from "zod";

export const updateUserSchema = {
  body: z.object({
    fullName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    profilePicture: z.string().optional(),
    dateOfBirth: z.string().optional(),
    englishLevel: z.string().optional(),
    learningGoals: z.array(z.string()).optional(),
  }),
};

export const getUsersQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    role: z.enum(["ADMINISTRATOR", "COURSESELLER"]).optional(),
  }),
};

// Admin-only: change a user's account status (suspend/ban/restore).
// Reason is required so the audit trail has context.
export const updateGamificationSchema = {
  body: z.object({
    xp:             z.number().int().min(0).optional(),
    streak:         z.number().int().min(0).optional(),
    lastActiveDate: z.string().datetime().optional(),
  }),
};

export const updateUserStatusSchema = {
  body: z
    .object({
      status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]),
      reason: z.string().min(3, "Lý do phải có ít nhất 3 ký tự").max(2000),
      // ISO date string; only honoured for SUSPENDED status.
      suspendedUntil: z.string().datetime().optional().nullable(),
    })
    .strict(),
};

export type UpdateUserInput = z.infer<typeof updateUserSchema.body>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema.query>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema.body>;
export type GamificationInput = z.infer<typeof updateGamificationSchema.body>;

export interface CourseSellerApplicationSummary {
  id: string;
  status: string;
  certification: string[];
  expertise: string[];
  message: string | null;
  rejectionReason: string | null;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  dateOfBirth: Date;
  englishLevel: string | null;
  learningGoals: string[];
  role: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  xp: number;
  streak: number;
  lastActiveDate: Date | null;
  courseSellerApplication?: CourseSellerApplicationSummary | null;
}

export interface UserBasicResponse {
  id: string;
  email: string;
  fullName: string;
  role: string | null;
  profilePicture: string | null;
}
