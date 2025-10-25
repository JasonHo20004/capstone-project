import { z } from "zod";

export const createTopupDTO = z.object({
  body: z.object({
    realMoney: z.number({
        error: (issue) =>
          issue.input === undefined
            ? "This field is required"
            : "Invalid Money Amount",
      }).positive({ message: "Amount must be positive" })
      .min(1000, { message: "Minimum top-up is 1000 VND" }),
  })
});
export type CreateTopupInput = z.infer<typeof createTopupDTO>
