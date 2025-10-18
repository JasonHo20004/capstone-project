import { z } from "zod";

export const createFlashcardDTO = z.object({
  body: z.object({
    frontContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid frontContent",
    }),
    backContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid frontContent",
    }),
    exampleSentence: z.string().optional(),
    audioUrl: z.string().optional(),
    deckId:z.uuid("Invalid Deck ID format")
  }),
});

export type CreateFlashcardInput = z.infer<typeof createFlashcardDTO>;
