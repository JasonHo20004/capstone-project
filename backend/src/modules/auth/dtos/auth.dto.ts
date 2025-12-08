import { z } from "zod";
import { UserRole } from "@prisma/client";

import type { User } from "@prisma/client";

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


export type LoginInput = z.infer<typeof loginDTO>["body"];
export type CreateRefreshTokenInput = z.infer<typeof createRefreshTokenDTO>

export type SafeUser = Omit<User, "password">;
// response
export const  loginResponseDTO = z.object({
  accessToken:z.string(),
  refreshToken: z.string(),
  userId:z.uuid(),
  email:z.email(),
  fullName:z.string(),
  role:z.enum(UserRole).nullable()
})
export type LoginResponse =z.infer<typeof loginResponseDTO>