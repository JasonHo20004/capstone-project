import { databaseService } from "@/services/database.service";
import { RevenueRepository } from "../repositories/revenue.repository";
import type { RevenueOverviewResponse } from "../dtos/revenue.dto";

export class RevenueService {
  private prisma = databaseService.getClient();
  private revenueRepository = new RevenueRepository();


  public async getRevenueOverview(
    period?: string,
    startDate?: string,
    endDate?: string,
    transactionType?: string,
    limit?: number,
    page?: number
  ): Promise<RevenueOverviewResponse> {
    let dateFilter: any = {};
    limit = limit || 50;
    page = page || 1;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        },
      };
    } else if (period) {
      switch (period) {
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
          startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
          dateFilter = {
            createdAt: {
              gte: startOfWeek,
              lte: new Date(
                startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1
              ),
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
          const startOfQuarter = new Date(
            now.getFullYear(),
            currentQuarter * 3,
            1
          );
          const endOfQuarter = new Date(
            now.getFullYear(),
            currentQuarter * 3 + 3,
            0
          );
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
        default:
          // No specific period, fetch all data or default to a reasonable range
          break;
      }
    }

    const whereClause: any = {
      ...dateFilter,
      status: "SUCCESS",
    };

    if (transactionType) {
      whereClause.transactionType = transactionType;
    }

    console.log("🧪🌡️whereClause: ", whereClause);

    // Get total count for pagination
    const totalTransactionsCount = await this.prisma.transaction.count({
      where: whereClause,
    });

    // Get paginated transactions
    const transactions = await this.prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + t.amount.toNumber(),
      0
    );

    return {
      totalRevenue,
      totalTransactions: transactions.length,
      pagination: {
        total: totalTransactionsCount,
        page,
        limit,
        totalPages: Math.ceil(totalTransactionsCount / limit),
      },
    };
  }

  // Get complete revenue data (stats + chart + transactions)
  public async getRevenueData(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
    page?: number;
    limit?: number;
  }) {
    const whereClause = this.revenueRepository.buildWhereClause(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 50;

    const [totalRevenue, totalTransactions, transactions, revenueByDay, revenueByType] = await Promise.all([
      this.revenueRepository.getTotalRevenue(whereClause),
      this.revenueRepository.getTransactionCount(whereClause),
      this.revenueRepository.getTransactions(whereClause, page, limit),
      this.revenueRepository.getRevenueByDay(whereClause, filters.period || "year"),
      this.revenueRepository.getRevenueByType(whereClause)
    ]);

    return {
      stats: {
        totalRevenue: Number(totalRevenue),
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? Number(totalRevenue) / totalTransactions : 0
      },
      chartData: revenueByDay.map(d => ({
        date: d.date,
        revenue: Number(d.revenue)
      })),
      revenueByType,
      transactions: transactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        status: t.status,
        transactionType: t.transactionType,
        createdAt: t.createdAt,
        description: t.description,
        user: t.wallet?.user ? {
          fullName: t.wallet.user.fullName,
          email: t.wallet.user.email
        } : null,
        order: t.order ? {
          id: t.order.id,
          totalAmount: Number(t.order.totalAmount)
        } : null
      })),
      pagination: {
        total: totalTransactions,
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit)
      }
    };
  }

  // Get revenue stats only
  public async getRevenueStats(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
  }) {
    const whereClause = this.revenueRepository.buildWhereClause(filters);

    const [totalRevenue, totalTransactions, revenueByType] = await Promise.all([
      this.revenueRepository.getTotalRevenue(whereClause),
      this.revenueRepository.getTransactionCount(whereClause),
      this.revenueRepository.getRevenueByType(whereClause)
    ]);

    return {
      totalRevenue: Number(totalRevenue),
      totalTransactions,
      averageTransaction: totalTransactions > 0 ? Number(totalRevenue) / totalTransactions : 0,
      revenueByType
    };
  }

  // Get transactions list only
  public async getTransactionsList(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
    page?: number;
    limit?: number;
  }) {
    const whereClause = this.revenueRepository.buildWhereClause(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 50;

    const [totalTransactions, transactions] = await Promise.all([
      this.revenueRepository.getTransactionCount(whereClause),
      this.revenueRepository.getTransactions(whereClause, page, limit)
    ]);

    return {
      transactions: transactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        status: t.status,
        transactionType: t.transactionType,
        createdAt: t.createdAt,
        description: t.description,
        user: t.wallet?.user ? {
          fullName: t.wallet.user.fullName,
          email: t.wallet.user.email
        } : null,
        order: t.order ? {
          id: t.order.id,
          totalAmount: Number(t.order.totalAmount)
        } : null
      })),
      pagination: {
        total: totalTransactions,
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit)
      }
    };
  }

  // Get all transactions for export
  public async getTransactionsForExport(filters: {
    startDate?: string;
    endDate?: string;
    period?: string;
    transactionType?: string;
  }) {
    const whereClause = this.revenueRepository.buildWhereClause(filters);
    const transactions = await this.revenueRepository.getAllTransactions(whereClause);

    return transactions.map(t => ({
      'Transaction ID': t.id,
      'Amount': Number(t.amount),
      'Status': t.status,
      'Type': t.transactionType,
      'Date': t.createdAt.toISOString(),
      'Description': t.description || '',
      'User Name': t.wallet?.user?.fullName || '',
      'User Email': t.wallet?.user?.email || '',
      'Order ID': t.order?.id || '',
      'Order Amount': t.order ? Number(t.order.totalAmount) : ''
    }));
  }
}
