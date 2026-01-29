// =============================================================================
// User DTOs - Data Transfer Objects for Users
// =============================================================================

import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    profilePicture: z.string().url().optional(),
    englishLevel: z.string().optional(),
    learningGoals: z.array(z.string()).optional(),
  }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    role: z.enum(["ADMINISTRATOR", "COURSESELLER"]).optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>["query"];

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
}

export interface UserBasicResponse {
  id: string;
  email: string;
  fullName: string;
  role: string | null;
  profilePicture: string | null;
}
