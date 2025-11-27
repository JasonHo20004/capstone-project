import { z } from "zod";

export const verifyEmailDTO = z.object({
  query: z.object({
    token: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Verification token is required"
            : "Invalid verification token",
      })
      .min(32, "Invalid verification token"),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailDTO>;


