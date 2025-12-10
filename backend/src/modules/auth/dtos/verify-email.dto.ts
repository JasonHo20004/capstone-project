import { z } from "zod";

export const verifyEmailDTO = z.object({
  query: z.object({
    token: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Mã xác minh là bắt buộc"
            : "Mã xác minh không hợp lệ",
      })
      .min(32, "Mã xác minh không hợp lệ"),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailDTO>;


