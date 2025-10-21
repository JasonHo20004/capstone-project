import { z } from "zod";

export const createFlashcardDTO = z.object({
  body: z.object({
    frontContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid frontContent",
    }).nonempty(),
    backContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid frontContent",
    }).nonempty(),
    exampleSentence: z.string().optional(),
    deckId:z.uuid("Invalid Deck ID format")
  }),
});

export const updateFlashcardDTO = z.object({
  body: z.object({
    frontContent: z.string().nonempty().optional(),
    backContent: z.string().nonempty().optional(),
    exampleSentence: z.string().optional()
   }),
   params: z.object({
    flashcardId:z.uuid({
      message: 'Flashcard ID must be a valid UUID'
    })
  })
});
export const deleteFlashcardDTO = z.object({
   params: z.object({
    flashcardId:z.uuid({
      message: 'Flashcard ID must be a valid UUID'
    })
  })
});

export type CreateFlashcardInput = z.infer<typeof createFlashcardDTO>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardDTO>;
export type DeleteFlashcardInput = z.infer<typeof deleteFlashcardDTO>;

