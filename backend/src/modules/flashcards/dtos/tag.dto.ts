import { z } from "zod";

export const createTagDTO = z.object({
  body: z.object({
    name: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid name",
    })
  }),
});

export type CreateTagInput = z.infer<typeof createTagDTO>;
