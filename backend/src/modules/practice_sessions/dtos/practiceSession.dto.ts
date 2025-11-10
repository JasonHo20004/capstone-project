import z from 'zod'

// request
export const startSessionDTO = z.object({
  body: z.object({
   testId: z.uuid({
      message: "Course ID must be a valid UUID",
    }),
    sectionIds: z.array(z.uuid()).optional(),
  })
})

export type StartSessionInput = z.infer<typeof startSessionDTO>

//response
const includedUserDTO = z.object({
  fullName: z.string(),
  email: z.email(),
});
const includedTestDTO = z.object({
  title: z.string(),
  durationInMinutes: z.number().int().nullable(),
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
export type CreateSessionResponse = z.infer<
  typeof createSessionResponseDTO
>;