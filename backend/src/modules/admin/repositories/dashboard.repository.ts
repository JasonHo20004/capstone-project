import { databaseService } from "@/services/database.service";

export class DashboardRepository {
  private prisma = databaseService.getClient();

  // Get total counts
  async getTotalUsers() {
    return this.prisma.user.count();
  }

  async getTotalCourses() {
    return this.prisma.course.count();
  }

  async getPendingApplications() {
    return this.prisma.courseSellerApplication.count({
      where: { status: 'PENDING' }
    });
  }

  // Get total revenue from transactions (only PAYMENT with order)
  async getTotalRevenue() {
    const result = await this.prisma.transaction.aggregate({
      where: {
        status: 'SUCCESS',
        transactionType: 'PAYMENT',
        orderId: { not: null } // Chỉ tính giao dịch có đơn hàng
      },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || 0;
  }

  // Get users created in the last month
  async getUsersLastMonth() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });
  }

  // Get users created in the month before last
  async getUsersPreviousMonth() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: lastMonth
        }
      }
    });
  }

  // Get courses created in the last month
  async getCoursesLastMonth() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return this.prisma.course.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });
  }

  // Get courses created in the month before last
  async getCoursesPreviousMonth() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    return this.prisma.course.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: lastMonth
        }
      }
    });
  }

  // Get revenue for the last month (chỉ PAYMENT)
  async getRevenueLastMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await this.prisma.transaction.aggregate({
      where: {
        status: 'SUCCESS',
        transactionType: 'PAYMENT',
        orderId: { not: null },
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || 0;
  }

  // Get revenue for the month before last (chỉ PAYMENT)
  async getRevenuePreviousMonth() {
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await this.prisma.transaction.aggregate({
      where: {
        status: 'SUCCESS',
        transactionType: 'PAYMENT',
        orderId: { not: null },
        createdAt: {
          gte: startOfPrevMonth,
          lt: endOfPrevMonth
        }
      },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || 0;
  }

  // Get revenue by month for the last N months (chỉ PAYMENT có order)
  async getRevenueByMonth(months: number = 6) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const transactions = await this.prisma.$queryRaw<Array<{ month: string; revenue: number }>>`
      SELECT
        CONCAT('T', EXTRACT(MONTH FROM created_at)::TEXT) as month,
        SUM(amount)::FLOAT as revenue
      FROM transactions
      WHERE
        status = 'SUCCESS'
        AND transaction_type = 'PAYMENT'
        AND order_id IS NOT NULL
        AND created_at >= ${startDate}
      GROUP BY EXTRACT(MONTH FROM created_at), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    return transactions;
  }

  // Get user growth by month for the last N months
  async getUserGrowthByMonth(months: number = 6) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const users = await this.prisma.$queryRaw<Array<{ name: string; value: number }>>`
      SELECT
        CONCAT('T', EXTRACT(MONTH FROM created_at)::TEXT) as name,
        COUNT(*)::INT as value
      FROM users
      WHERE created_at >= ${startDate}
      GROUP BY EXTRACT(MONTH FROM created_at), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    return users;
  }

  // Get course status distribution
  async getCourseStatusDistribution() {
    const statuses = await this.prisma.course.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return statuses.map(s => ({
      name: s.status,
      value: s._count.status
    }));
  }
}
