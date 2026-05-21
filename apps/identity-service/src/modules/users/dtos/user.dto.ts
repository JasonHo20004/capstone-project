// =============================================================================
// User DTOs - Data Transfer Objects for Users
// =============================================================================

import { z } from "zod";

export const updateUserSchema = {
  body: z.object({
    fullName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    profilePicture: z.string().url().optional(),
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

export type UpdateUserInput = z.infer<typeof updateUserSchema.body>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema.query>;

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
  courseSellerApplication?: CourseSellerApplicationSummary | null;
}

export interface UserBasicResponse {
  id: string;
  email: string;
  fullName: string;
  role: string | null;
  profilePicture: string | null;
}
