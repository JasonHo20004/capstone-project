import { z } from "zod";

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
      .max(20),
  }),
});

export type CreateUserInput = z.infer<typeof createUserDTO>["body"];
