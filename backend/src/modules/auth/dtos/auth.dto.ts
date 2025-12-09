import { z } from "zod";
import { UserRole } from "@/../generated/prisma";

import type { User } from "@/../generated/prisma";

export const loginDTO = z.object({
  body: z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? "Trường này là bắt buộc" : "Email không hợp lệ",
    }),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Trường này là bắt buộc"
            : "Mật khẩu không hợp lệ",
      })
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
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