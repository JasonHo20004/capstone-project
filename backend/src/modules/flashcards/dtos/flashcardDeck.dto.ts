import { z } from "zod";

export const createFlashcardDeckDTO = z.object({
  body: z.object({
    title: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid title",
    }),
    description: z.string().nullable().optional(),
    tagIds: z.array(z.uuid("Invalid tag ID format")).nonempty({ message: "You must select at least one tag." }),
  }),
});

export type CreateFlashcardDeckInput = z.infer<typeof createFlashcardDeckDTO>;
