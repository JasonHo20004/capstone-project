import { databaseService } from "@/services/database.service";
import type { Report, EReasonType} from "@/../../generated/prisma";
import type {CreateReportResponse, GetReportResponse} from "@/modules/reports/dtos/report.dto"
export class ReportRepository {
  private prisma = databaseService.getClient();
  // check User reported the course
  public async findCourseReportByUser(
    userId: string,
    courseId: string
  ): Promise<Report | null> {
    return this.prisma.report.findFirst({
      where: {
        userId,
        courseId,
      },
    });
  }
  public async createReportCourse(dataReport: {
    userId: string;
    courseId: string;
    reasonType: EReasonType;
    content: string;
  }): Promise<CreateReportResponse> {
    return this.prisma.report.create({
      data: dataReport,
      include:{
        course:{
            select:{
                id:true,
                title:true
            }
        },
        user:{
            select:{
                id:true,
                fullName:true,
                email:true
            }
        }

      }
    });
  }
  public getAllReports():Promise<GetReportResponse[]>{
    return this.prisma.report.findMany({
      include:{
        user:{
          select:{id: true,
            fullName:true,
            email:true,
          }
        },
        course:{
          select:{id: true,
            title:true
          }
        }
      }
    })
  }
}
