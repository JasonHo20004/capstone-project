import { z} from "zod";
import type { User } from "@prisma/client";
import { UserRole,ApplicationStatus } from "@prisma/client";

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
    phoneNumber: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "This field is required"
            : "Invalid Password",
      })
      .max(20)
      .nullable(),
  }),
});

export const updateUserDTO = z.object({
  body: z.object({
    fullName: z.string().nonempty().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    englishLevel: z.string().nullable().optional(),
    learningGoals: z.array(z.string()).optional(),
  }),
});

export const createCourseSellerApplicationDTO = z.object({
  body: z.object({
    expertise: z.preprocess(
      (val) => {
        if (Array.isArray(val)) return val; // Nếu là mảng thì giữ nguyên
        if (typeof val === "string" && val.trim() !== "") return [val]; // Nếu là string thì bọc vào mảng
        return []; // Các trường hợp khác trả về mảng rỗng
      },
      z.array(z.string()).min(1, "Vui lòng nhập ít nhất 1 chuyên môn")
    ),
  }),
});

export type CreateUserInput = z.infer<typeof createUserDTO>;
export type UpdateUserInput = z.infer<typeof updateUserDTO>;

export type CreateCourseSellerApplicationInput = z.infer<
  typeof createCourseSellerApplicationDTO
>;

export type SafeUser = Omit<User, "password">;

// Response

export const includedWalletDTO = z.object({
  allowance: z.number(),
});
export const includedCourseSellerApplicationDTO = z.object({
  id:z.uuid(),
  status:z.enum(ApplicationStatus),
  createdAt:z.coerce.date(),
  message:z.string().nullable(),
  rejectionReason: z.string().nullable(),
  expertise:z.array(z.string()),
})
export const includedCourseSellerProfileDTO = z.object({
  certification:z.array(z.string()),
  expertise:z.array(z.string())
}
)
export const userProfileResponseDTO = z.object({
  id: z.uuid(),
  email: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  profilePicture: z.string(),
  dateOfBirth: z.coerce.date(),
  createdAt: z.coerce.date(),
  englishLevel: z.uuid(),
  learningGoals: z.array(z.string()),
  role: z.enum(UserRole).nullable,
  wallet: includedWalletDTO.nullable(),
  courseSellerProfile:includedCourseSellerProfileDTO.nullable(),
  courseSellerApplication:includedCourseSellerApplicationDTO.nullable()
});
export type UserProfileResponse = z.infer<typeof userProfileResponseDTO>