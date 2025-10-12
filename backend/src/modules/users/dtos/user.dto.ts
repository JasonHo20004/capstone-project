import { z } from "zod";
import type { User } from "@/../generated/prisma";
// DTO là lớp bảo vệ và nó sẽ là con của Input (Interface)
// Khi mà 
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
    rejectionReason: z.string().nonempty().optional(),
    messsage: z.string().nullable().optional(),
  }),
  
  params: z.object({
    userId: z.uuid({ error: 'User ID is not correct' }),
  }),
});


export const createCourseSellerApplicationDTO = z.object({
  body: z.object({
    certification: z.array(z.string()),
    expertise: z.array(z.string()),
  }),
  params: z.object({
    userId: z.uuid({ error: 'User ID is not correct' }),
  }),
});




export type CreateUserInput = z.infer<typeof createUserDTO>;
export type UpdateUserInput = z.infer<typeof updateUserDTO>;

export type CreateCourseSellerApplicationInput = z.infer<typeof createCourseSellerApplicationDTO>

export type SafeUser = Omit<User, 'password'>;
