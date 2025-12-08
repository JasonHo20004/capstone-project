import { z } from "zod";
import  {EReasonType} from "@prisma/client";


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
      message: "Course ID must be a valid UUID",
    }),
  }),
});

export const getDetailReportDTO = z.object({
  params: z.object({
    reportId: z.uuid({
      message: "Report ID must be a valid UUID",
    }),
  }),
})
export type CreateReportCourseInput = z.infer<typeof createReportCourseDTO>;
export type GetDetailReportInput = z.infer<typeof getDetailReportDTO>
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
export const GetReportResponseDTO = z.object({
 
  id: z.uuid(),
  content: z.string(),
  reasonType: z.enum(EReasonType),
  createdAt: z.date(), 
  course: ReportCourseResponseDTO,
  user: ReportUserResponseDTO, 
});

export type CreateReportResponse = z.infer<typeof CreateReportResponseDTO>;
export type GetReportResponse = z.infer<typeof GetReportResponseDTO>;