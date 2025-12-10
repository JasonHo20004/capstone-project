import z from "zod";

// request
export const startSessionDTO = z.object({
  body: z.object({
    testId: z.uuid({
      message: "ID bài kiểm tra phải là UUID hợp lệ",
    }),
    sectionIds: z.array(z.uuid()).optional(),
  }),
});

export const answerQuestionDTO = z.object({
  body: z.object({
    questionId: z.uuid({ message: "ID câu hỏi phải là UUID hợp lệ" }),
    selectedOptionIndex: z.number().int().nullable().optional(),
    answerText: z.string().nullable().optional(),
  }),
  params: z.object({
    sessionId: z.uuid({ message: "ID phiên làm bài phải là UUID hợp lệ" }),
  }),
});

export const submitDTO = z.object({
  params: z.object({
    sessionId: z.uuid({ message: "ID phiên làm bài phải là UUID hợp lệ" }),
  }),
});

export type StartSessionInput = z.infer<typeof startSessionDTO>;
export type AnswerQuestionInput = z.infer<typeof answerQuestionDTO>;
export type SubmitInput = z.infer<typeof submitDTO>
//response
const includedUserDTO = z.object({
  fullName: z.string(),
  email: z.email(),
});
const includedEnglistTestTypeDTO = z.object({
  id:z.uuid(),
  name:z.string()
})
const includedTestDTO = z.object({
  title: z.string(),
  durationInMinutes: z.number().int().nullable(),
  englishTestType:includedEnglistTestTypeDTO
});


export const createSessionResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  testId: z.uuid(),
  selectedSections: z.array(z.string()),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  user: includedUserDTO,
  test: includedTestDTO,
});
export const findSessionResponseDTO = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  testId: z.uuid(),
  selectedSections: z.array(z.string()),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  user: includedUserDTO,
  test: includedTestDTO,
});

export type CreateSessionResponse = z.infer<typeof createSessionResponseDTO>;
export type FindSessionResponse = z.infer<typeof findSessionResponseDTO>;

