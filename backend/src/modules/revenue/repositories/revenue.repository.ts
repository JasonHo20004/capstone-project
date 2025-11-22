import { databaseService } from "@/services/database.service";
import type { Prisma } from "@/../generated/prisma";

export class RevenueRepository {
  private prisma = databaseService.getClient();

  // Build where clause for revenue queries
  buildWhereClause(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
  }): Prisma.TransactionWhereInput {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let dateFilter: any = {};

    // Custom date range
    if (filters.startDate && filters.endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)),
        },
      };
    }
    // Predefined periods
    else if (filters.period && filters.period !== 'all') {
      switch (filters.period) {
        case "today":
          dateFilter = {
            createdAt: {
              gte: now,
              lte: new Date(now.getTime() + 24 * 60 * 60 * 1000 - 1),
            },
          };
          break;
        case "week":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          dateFilter = {
            createdAt: {
              gte: startOfWeek,
              lte: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
            },
          };
          break;
        case "month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          };
          break;
        case "quarter":
          const currentMonth = now.getMonth();
          const currentQuarter = Math.floor(currentMonth / 3);
          const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
          const endOfQuarter = new Date(now.getFullYear(), currentQuarter * 3 + 3, 0);
          endOfQuarter.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfQuarter,
              lte: endOfQuarter,
            },
          };
          break;
        case "year":
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          endOfYear.setHours(23, 59, 59, 999);
          dateFilter = {
            createdAt: {
              gte: startOfYear,
              lte: endOfYear,
            },
          };
          break;
      }
    }

    const whereClause: Prisma.TransactionWhereInput = {
      ...dateFilter,
      status: "SUCCESS",
      transactionType: filters.transactionType && filters.transactionType !== 'all'
        ? filters.transactionType as any
        : undefined,
    };

    return whereClause;
  }

  // Get total revenue (PAYMENT only with order)
  async getTotalRevenue(whereClause: Prisma.TransactionWhereInput) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        ...whereClause,
        transactionType: 'PAYMENT',
        orderId: { not: null }
      },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || 0;
  }

  // Get transaction count
  async getTransactionCount(whereClause: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.count({ where: whereClause });
  }

  // Get transactions with pagination
  async getTransactions(
    whereClause: Prisma.TransactionWhereInput,
    page: number = 1,
    limit: number = 50
  ) {
    return this.prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: {
          select: {
            userId: true,
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        },
        order: {
          select: {
            id: true,
            totalAmount: true
          }
        }
      }
    });
  }

  // Get revenue by day for chart
  async getRevenueByDay(whereClause: Prisma.TransactionWhereInput, period: string) {
    // Determine the start date for the chart
    let chartStartDate = new Date();
    switch (period) {
      case "today":
        chartStartDate.setDate(chartStartDate.getDate() - 1);
        break;
      case "week":
        chartStartDate.setDate(chartStartDate.getDate() - 7);
        break;
      case "month":
        chartStartDate.setMonth(chartStartDate.getMonth() - 1);
        break;
      case "quarter":
        chartStartDate.setMonth(chartStartDate.getMonth() - 3);
        break;
      case "year":
        chartStartDate.setFullYear(chartStartDate.getFullYear() - 1);
        break;
    }

    // Use the filter's start date if it's more restrictive
    if (whereClause.createdAt && typeof whereClause.createdAt === 'object' && !(whereClause.createdAt instanceof Date)) {
      const dateFilter = whereClause.createdAt as any;
      if (dateFilter.gte && dateFilter.gte > chartStartDate) {
        chartStartDate = dateFilter.gte;
      }
    } else if (whereClause.createdAt instanceof Date && whereClause.createdAt > chartStartDate) {
      chartStartDate = whereClause.createdAt;
    }

    // Build the end date
    let chartEndDate = new Date();
    if (whereClause.createdAt && typeof whereClause.createdAt === 'object' && !(whereClause.createdAt instanceof Date)) {
      const dateFilter = whereClause.createdAt as any;
      if (dateFilter.lte) {
        chartEndDate = dateFilter.lte;
      }
    } else if (whereClause.createdAt instanceof Date) {
      chartEndDate = whereClause.createdAt;
    }

    const data = await this.prisma.$queryRaw<Array<{ date: string; revenue: number }>>`
      SELECT
        TO_CHAR(created_at, 'DD/MM') as date,
        SUM(amount)::FLOAT as revenue
      FROM transactions
      WHERE
        status = 'SUCCESS'
        AND transaction_type = 'PAYMENT'
        AND order_id IS NOT NULL
        AND created_at >= ${chartStartDate}
        AND created_at <= ${chartEndDate}
      GROUP BY DATE(created_at), TO_CHAR(created_at, 'DD/MM')
      ORDER BY DATE(created_at) ASC
    `;


    return data;
  }

  // Get revenue by transaction type
  async getRevenueByType(whereClause: Prisma.TransactionWhereInput) {
    const data = await this.prisma.transaction.groupBy({
      by: ['transactionType'],
      where: whereClause,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    return data.map(item => ({
      type: item.transactionType,
      revenue: Number(item._sum.amount || 0),
      count: item._count.id
    }));
  }

  // Get all transactions for export (no pagination)
  async getAllTransactions(whereClause: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: {
          select: {
            user: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        },
        order: {
          select: {
            id: true,
            totalAmount: true
          }
        }
      }
    });
  }
}
