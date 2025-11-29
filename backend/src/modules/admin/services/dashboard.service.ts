import { DashboardRepository } from "@/modules/admin/repositories/dashboard.repository";

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  private calculateGrowth(
    current: number | bigint,
    previous: number | bigint
  ): number {
    const currentNum = Number(current);
    const previousNum = Number(previous);

    if (previousNum === 0) return currentNum > 0 ? 100 : 0;
    return Number(
      (((currentNum - previousNum) / previousNum) * 100).toFixed(1)
    );
  }

  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalRevenue,
      pendingApplications,
      usersLastMonth,
      usersPreviousMonth,
      coursesLastMonth,
      coursesPreviousMonth,
      revenueLastMonth,
      revenuePreviousMonth,
    ] = await Promise.all([
      this.dashboardRepository.getTotalUsers(),
      this.dashboardRepository.getTotalCourses(),
      this.dashboardRepository.getTotalRevenue(),
      this.dashboardRepository.getPendingApplications(),
      this.dashboardRepository.getUsersLastMonth(),
      this.dashboardRepository.getUsersPreviousMonth(),
      this.dashboardRepository.getCoursesLastMonth(),
      this.dashboardRepository.getCoursesPreviousMonth(),
      this.dashboardRepository.getRevenueLastMonth(),
      this.dashboardRepository.getRevenuePreviousMonth(),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalRevenue: Number(totalRevenue),
      pendingApplications,
      monthlyGrowth: {
        users: this.calculateGrowth(usersLastMonth, usersPreviousMonth),
        courses: this.calculateGrowth(coursesLastMonth, coursesPreviousMonth),
        revenue: this.calculateGrowth(
          Number(revenueLastMonth),
          Number(revenuePreviousMonth)
        ),
      },
    };
  }

  async getRevenueData(months: number = 6) {
    const data = await this.dashboardRepository.getRevenueByMonth(months);
    return data.map((d) => ({
      month: d.month,
      revenue: Number(d.revenue),
    }));
  }

  async getUserGrowthData(months: number = 6) {
    return this.dashboardRepository.getUserGrowthByMonth(months);
  }

  async getCourseStatusData() {
    return this.dashboardRepository.getCourseStatusDistribution();
  }

  async getDashboardData() {
    const [stats, revenueData, userGrowthData, courseStatusData] =
      await Promise.all([
        this.getDashboardStats(),
        this.getRevenueData(6),
        this.getUserGrowthData(6),
        this.getCourseStatusData(),
      ]);

    return {
      stats,
      revenueData,
      userGrowthData,
      courseStatusData,
    };
  }
}
