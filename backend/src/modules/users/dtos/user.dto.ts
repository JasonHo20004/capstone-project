import { z } from "zod";
import type { User } from "@/../generated/prisma";

export const createUserDTO = z.object({
  body: z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid Email",
    }),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "This field is required"
            : "Invalid Password",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(255),

    fullName: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "This field is required" : "Invalid Name",
      })
      .min(8, "Name must be at least 8 characters long")
      .max(255),
    dateOfBirth: z.coerce.date({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid Date",
    }),
    phoneNumber: z.string({
        error: (issue) =>
          issue.input === undefined
            ? "This field is required"
            : "Invalid Password",
      })
      .max(20).nullable(),
  }),
});

export const updateUserDTO = z.object({
  body: z.object({
    fullName: z.string().nonempty().optional(),
    phoneNumber: z.string().nullable().optional(),
    dateOfBirth: z.coerce.date().optional(),
    profilePicture: z.string().nullable().optional(),
    englishLevel: z.string().nullable().optional(),
    learningGoals: z.array(z.string()).optional(),
  }),
  
  params: z.object({
    userId: z.uuid({ error: 'User ID is not correct' }),
  }),
});


export const createCourseSellerProfileDTO = z.object({
  body: z.object({
    certification: z.array(z.string()),
    expertise: z.array(z.string()),
  }),
  params: z.object({
    userId: z.uuid({ error: 'User ID is not correct' }),
  }),
});




export type CreateUserInput = z.infer<typeof createUserDTO>["body"];
export type UpdateUserInput = z.infer<typeof updateUserDTO>;

export type CreateCourseSellerInput = z.infer<typeof createCourseSellerProfileDTO>

export type SafeUser = Omit<User, 'password'>;
