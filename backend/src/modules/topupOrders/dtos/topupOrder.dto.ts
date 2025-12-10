import { z } from "zod";

export const createTopupDTO = z.object({
  body: z.object({
    realMoney: z.number({
        error: (issue) =>
          issue.input === undefined
            ? "Trường này là bắt buộc"
            : "Số tiền không hợp lệ",
      }).positive({ message: "Số tiền phải là số dương" })
      .min(1000, { message: "Số tiền nạp tối thiểu là 1000 VND" }),
  })
});




export type CreateTopupInput = z.infer<typeof createTopupDTO>
