import { z } from "zod";
import type { User } from "@/../generated/prisma";

export const loginDTO = z.object({
  body: z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid Email",
    }),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "This field is required"
            : "Invalid Password",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(255),
  }),
});

// export const authenticatedRequestDTO = z.object({
//   headers: z.object({
//     userId: z.uuid({ error: "User ID is not correct" }),
//   }),
// });
export const createRefreshTokenDTO = z.object({
  userId: z.uuid(),
  hashedToken: z.string(),
});
export const refreshTokenDTO = z.boolean()

export type LoginInput = z.infer<typeof loginDTO>["body"];
export type CreateRefreshTokenInput = z.infer<typeof createRefreshTokenDTO>

export type SafeUser = Omit<User, "password">;
