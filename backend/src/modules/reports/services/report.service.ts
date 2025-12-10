import { ReportRepository } from "@/modules/reports/repositories/report.repository";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { CourseRepository } from "@/modules/courses/repositories/course.repository";
import { UserActivityRepository } from "@/modules/users/repositories/userActivity.repository";
import type { EReasonType } from "@/../generated/prisma";
import type { CreateReportResponse ,GetReportResponse} from "@/modules/reports/dtos/report.dto";

export class ReportService {
  private reportRepository = new ReportRepository();
  private userRepository = new UserRepository();
  private courseRepository = new CourseRepository();
  private userActivityRepository = new UserActivityRepository();
  public async createReportCourse(
    userId: string,
    dataReport: {
      courseId: string;
      reasonType: EReasonType;
      content: string;
    }
  ): Promise<CreateReportResponse> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw Error("Người dùng không tồn tại");
    }

    const existingCourse = await this.courseRepository.findCourseAvailableById(
      dataReport.courseId
    );
    if (!existingCourse) {
      throw Error("Khóa học không tồn tại hoặc đang chờ duyệt");
    }
    const isUserActivity = await this.userActivityRepository.findActivity(
      userId,
      dataReport.courseId
    );
    if (!isUserActivity) {
      throw Error("Người dùng chưa mua khóa học này");
    }
    if ((existingCourse.courseSellerId === userId)) {
      throw Error("Bạn không thể báo cáo khóa học của chính mình");
    }
    const existingReport = await this.reportRepository.findCourseReportByUser(
      userId,
      dataReport.courseId
    );
    if (existingReport) {
      throw Error(`Bạn đã báo cáo khóa học này: ${existingCourse.title}`);
    }

    const newReport = await this.reportRepository.createReportCourse({
      userId,
      ...dataReport,
    });
    return newReport;
  }

  public async getAllReports():Promise<GetReportResponse[]>{
    return  this.reportRepository.getAllReports()
  }

  public async getDetailReport(reportId:string):Promise<GetReportResponse>{
    const report= await this.reportRepository.getReportById(reportId)
    if(!report){
      throw Error ("Báo cáo không tồn tại")
    }
    return report
  }
}