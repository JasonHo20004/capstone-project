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
      throw Error("User is not exist");
    }

    const existingCourse = await this.courseRepository.findCourseAvailableById(
      dataReport.courseId
    );
    if (!existingCourse) {
      throw Error("Course is not exist and is PENDING");
    }
    const isUserActivity = await this.userActivityRepository.findActivity(
      userId,
      dataReport.courseId
    );
    if (!isUserActivity) {
      throw Error("This user does not buy this course ");
    }
    if ((existingCourse.courseSellerId === userId)) {
      throw Error("You can not report your course");
    }
    const existingReport = await this.reportRepository.findCourseReportByUser(
      userId,
      dataReport.courseId
    );
    if (existingReport) {
      throw Error(`You reported this course ${existingCourse.title}`);
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
}
