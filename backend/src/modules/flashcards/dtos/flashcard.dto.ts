import { z } from "zod";

export const getAllFlashcardDTO =z.object({
  params:z.object({
    deckId:z.uuid({
      message: 'ID bộ thẻ phải là UUID hợp lệ'
    })
  })
})
export const createFlashcardDTO = z.object({
  body: z.object({
    frontContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "Trường này là bắt buộc" : "Nội dung mặt trước không hợp lệ",
    }).nonempty(),
    backContent: z.string({
      error: (issue) =>
        issue.input === undefined ? "Trường này là bắt buộc" : "Nội dung mặt sau không hợp lệ",
    }).nonempty(),
    exampleSentence: z.string().optional(),
    deckId:z.uuid("Định dạng ID bộ thẻ không hợp lệ")
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
      message: 'ID thẻ flashcard phải là UUID hợp lệ'
    })
  })
});
export const deleteFlashcardDTO = z.object({
   params: z.object({
    flashcardId:z.uuid({
      message: 'ID thẻ flashcard phải là UUID hợp lệ'
    })
  })
});

export type GetAllFlashcardInput = z.infer<typeof getAllFlashcardDTO>
export type CreateFlashcardInput = z.infer<typeof createFlashcardDTO>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardDTO>;
export type DeleteFlashcardInput = z.infer<typeof deleteFlashcardDTO>;

