import { databaseService } from "@/services/database.service";
import type { Prisma } from "@/../generated/prisma";

export class RevenueRepository {
  private prisma = databaseService.getClient();

  buildWhereClause(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
  }): Prisma.TransactionWhereInput {
    const now = new Date();
    let dateFilter: any = {};

    if (filters.startDate && filters.endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)),
        },
      };
    } else if (filters.period && filters.period !== "all") {
      const startDate = new Date();

      switch (filters.period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          };
          break;
        case "week":
        case "7days":
          startDate.setDate(startDate.getDate() - 7);
          dateFilter = {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          };
          break;
        case "month":
        case "30days":
          startDate.setDate(startDate.getDate() - 30);
          dateFilter = {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          };
          break;
        case "quarter":
        case "3months":
          startDate.setMonth(startDate.getMonth() - 3);
          dateFilter = {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          };
          break;
        case "year":
        case "1year":
          startDate.setFullYear(startDate.getFullYear() - 1);
          dateFilter = {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          };
          break;
      }
    }

    const whereClause: Prisma.TransactionWhereInput = {
      ...dateFilter,
      status: "SUCCESS",
      transactionType:
        filters.transactionType && filters.transactionType !== "all"
          ? (filters.transactionType as any)
          : undefined,
    };

    return whereClause;
  }

  async getTotalRevenue(whereClause: Prisma.TransactionWhereInput) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        ...whereClause,
        transactionType: "PAYMENT",
        orderId: { not: null },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  async getTransactionCount(whereClause: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.count({ where: whereClause });
  }

  async getTransactions(
    whereClause: Prisma.TransactionWhereInput,
    page: number = 1,
    limit: number = 50
  ) {
    return this.prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        wallet: {
          select: {
            userId: true,
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
          },
        },
      },
    });
  }

  async getRevenueByDay(
    whereClause: Prisma.TransactionWhereInput,
    period: string
  ) {
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
    if (
      whereClause.createdAt &&
      typeof whereClause.createdAt === "object" &&
      !(whereClause.createdAt instanceof Date)
    ) {
      const dateFilter = whereClause.createdAt as any;
      if (dateFilter.gte && dateFilter.gte > chartStartDate) {
        chartStartDate = dateFilter.gte;
      }
    } else if (
      whereClause.createdAt instanceof Date &&
      whereClause.createdAt > chartStartDate
    ) {
      chartStartDate = whereClause.createdAt;
    }

    // Build the end date
    let chartEndDate = new Date();
    if (
      whereClause.createdAt &&
      typeof whereClause.createdAt === "object" &&
      !(whereClause.createdAt instanceof Date)
    ) {
      const dateFilter = whereClause.createdAt as any;
      if (dateFilter.lte) {
        chartEndDate = dateFilter.lte;
      }
    } else if (whereClause.createdAt instanceof Date) {
      chartEndDate = whereClause.createdAt;
    }

    const data = await this.prisma.$queryRaw<
      Array<{ date: string; revenue: number }>
    >`
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
      by: ["transactionType"],
      where: whereClause,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    return data.map((item) => ({
      type: item.transactionType,
      revenue: Number(item._sum.amount || 0),
      count: item._count.id,
    }));
  }

  // // Get all transactions for export (no pagination)
  // async getAllTransactions(whereClause: Prisma.TransactionWhereInput) {
  //   return this.prisma.transaction.findMany({
  //     where: whereClause,
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       wallet: {
  //         select: {
  //           user: {
  //             select: {
  //               fullName: true,
  //               email: true,
  //             },
  //           },
  //         },
  //       },
  //       order: {
  //         select: {
  //           id: true,
  //           totalAmount: true,
  //         },
  //       },
  //     },
  //   });
  // }
}
