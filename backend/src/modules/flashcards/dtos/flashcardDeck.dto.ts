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


export const updateFlashcardDeckDTO = z.object({
  body: z.object({
    title: z.string().nonempty().optional(),
    description: z.string().nullable().optional(),
    tagIds: z.array(z.uuid("Invalid tag ID format")).nonempty({ message: "You must select at least one tag." }).optional(),
  }),
  params: z.object({
    flashcardDeckId:z.uuid({
      message: 'Deck ID must be a valid UUID'
    })
  })
});

export const deleteFlashcardDeckDTO = z.object({
  params: z.object({
    flashcardDeckId:z.uuid({
      message: 'Deck ID must be a valid UUID'
    })
  })
});
export type CreateFlashcardDeckInput = z.infer<typeof createFlashcardDeckDTO>;
export type UpdateFlashcardDeckInput = z.infer<typeof updateFlashcardDeckDTO>
export type DeleteFlashcardDeckInput = z.infer<typeof deleteFlashcardDeckDTO>
// response
export const includedUserDTO = z.object({
  fullName:z.string(),
  email:z.email(),
})
export const includedTagDTO=z.object({
  id:z.uuid(),
  name:z.string()
})
export const includedDeckTagDTO=z.object({
  tag:includedTagDTO
})
export const getAllFlashcardDeckResponseDTO = z.object({
  id:z.uuid(),
  title:z.string(),
  createdAt:z.coerce.date(),
  description:z.string().nullable(),
  isPublic:z.boolean(),
  userId:z.string(),
  user:includedUserDTO,
  deckTags:z.array(includedDeckTagDTO)
})
export type GetAllFlashcardDeckResponse = z.infer<typeof getAllFlashcardDeckResponseDTO >