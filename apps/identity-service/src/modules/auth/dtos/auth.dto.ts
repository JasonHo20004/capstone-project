// =============================================================================
// Auth DTOs - Data Transfer Objects for Authentication
// =============================================================================

import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
};

export const registerSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().min(1, "Full name is required"),
    dateOfBirth: z.string().transform((str) => new Date(str)),
    phoneNumber: z.string().optional(),
  }),
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
};

export const verifyEmailSchema = {
  query: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
};

export const resendVerificationSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
};

export type LoginInput = z.infer<typeof loginSchema.body>;
export type RegisterInput = z.infer<typeof registerSchema.body>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema.body>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema.body>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema.body>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema.body>;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
