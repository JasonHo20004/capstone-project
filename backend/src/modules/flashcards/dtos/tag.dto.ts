import { z } from "zod";

export const createTagDTO = z.object({
  body: z.object({
    name: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid name",
    })
  }),
});


export const updateTagDTO = z.object({
  body: z.object({
    name: z.string().optional(), // Make fields optional for updates
  }),
  params: z.object({
    tagId:z.uuid({
      message: 'Tag ID must be a valid UUID'
    })
  })
});
export type CreateTagInput = z.infer<typeof createTagDTO>;
export type UpdateTagInput = z.infer<typeof updateTagDTO>;