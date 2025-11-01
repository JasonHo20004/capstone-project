import { z } from "zod";
import  {EReasonType} from "@/../generated/prisma";


// request
export const createReportCourseDTO = z.object({
  body: z.object({
    reasonType:z.enum(EReasonType,{
      error:(issue) =>
        issue.input === undefined ? "This field is required" : "Invalid reason type",
    }),
    content:z.string({
      error: (issue) =>
        issue.input === undefined ? "This field is required" : "Invalid content",
    }),
  }),
  params: z.object({
    courseId: z.uuid({
      message: "Flashcard ID must be a valid UUID",
    }),
  }),
});

export type CreateReportCourseInput = z.infer<typeof createReportCourseDTO>;
// response
const ReportCourseResponseDTO = z.object({
  id: z.uuid(),
  title: z.string(),
});
const ReportUserResponseDTO = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
});
export const CreateReportResponseDTO = z.object({
 
  id: z.uuid(),
  content: z.string(),
  reasonType: z.enum(EReasonType),
  createdAt: z.date(), 
  course: ReportCourseResponseDTO,
  user: ReportUserResponseDTO, 
});
export type CreateReportResponse = z.infer<typeof CreateReportResponseDTO>;