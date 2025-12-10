import { databaseService } from "@/services/database.service";
import type { Prisma } from "@prisma/client";

export class TransactionManagementRepository {
  private prisma = databaseService.getClient();

  // Build where clause for transaction queries
  buildWhereClause(filters: {
    search?: string;
    status?: string;
    transactionType?: string;
    startDate?: string;
    endDate?: string;
    walletId?: string;
  }): Prisma.TransactionWhereInput {
    const whereClause: Prisma.TransactionWhereInput = {};

    // Search by user info, description, or exact transaction ID
    if (filters.search) {
      const searchTerm = filters.search.trim();
      const searchClauses: any[] = [];

      // Search in description field
      searchClauses.push({
        description: { contains: searchTerm, mode: 'insensitive' }
      });

      // Search in user's full name
      searchClauses.push({
        wallet: {
          user: {
            fullName: { contains: searchTerm, mode: 'insensitive' }
          }
        }
      });

      // Search in user's email
      searchClauses.push({
        wallet: {
          user: {
            email: { contains: searchTerm, mode: 'insensitive' }
          }
        }
      });

      // Check if search looks like a UUID (for exact ID match)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(searchTerm)) {
        searchClauses.push({ id: searchTerm });
      }

      whereClause.OR = searchClauses;
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      whereClause.status = filters.status as any;
    }

    // Filter by transaction type
    if (filters.transactionType && filters.transactionType !== 'all') {
      whereClause.transactionType = filters.transactionType as any;
    }

    // Filter by wallet ID
    if (filters.walletId) {
      whereClause.walletId = filters.walletId;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      whereClause.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999))
      };
    } else if (filters.startDate) {
      whereClause.createdAt = { gte: new Date(filters.startDate) };
    } else if (filters.endDate) {
      whereClause.createdAt = { lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)) };
    }

    return whereClause;
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
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profilePicture: true
              }
            }
          }
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true
          }
        },
        topupOrder: {
          select: {
            id: true,
            realMoney: true,
            paymentMethod: true
          }
        }
      }
    });
  }

  // Get transaction count
  async getTransactionCount(whereClause: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.count({ where: whereClause });
  }

  // Get transaction by ID
  async getTransactionById(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                profilePicture: true
              }
            }
          }
        },
        order: {
          include: {
            cart: {
              include: {
                cartItems: {
                  include: {
                    course: {
                      select: {
                        id: true,
                        title: true,
                        price: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        topupOrder: true,
        subscriptionContract: {
          include: {
            subscriptionPlan: true
          }
        }
      }
    });
  }

  // // Get transaction statistics
  // async getTransactionStats(whereClause: Prisma.TransactionWhereInput) {
  //   const [totalTransactions, successCount, pendingCount, failedCount, totalAmount] = await Promise.all([
  //     this.prisma.transaction.count({ where: whereClause }),
  //     this.prisma.transaction.count({ where: { ...whereClause, status: 'SUCCESS' } }),
  //     this.prisma.transaction.count({ where: { ...whereClause, status: 'PENDING' } }),
  //     this.prisma.transaction.count({ where: { ...whereClause, status: 'FAILED' } }),
  //     this.prisma.transaction.aggregate({
  //       where: { ...whereClause, status: 'SUCCESS' },
  //       _sum: { amount: true }
  //     })
  //   ]);

  //   // Get transaction count by type
  //   const byType = await this.prisma.transaction.groupBy({
  //     by: ['transactionType'],
  //     where: whereClause,
  //     _count: { id: true },
  //     _sum: { amount: true }
  //   });

  //   return {
  //     totalTransactions,
  //     successCount,
  //     pendingCount,
  //     failedCount,
  //     totalAmount: totalAmount._sum.amount || 0,
  //     byType: byType.map(t => ({
  //       type: t.transactionType,
  //       count: t._count.id,
  //       amount: t._sum.amount || 0
  //     }))
  //   };
  // }

  // // Get all transactions for export (no pagination)
  // async getAllTransactionsForExport(whereClause: Prisma.TransactionWhereInput) {
  //   return this.prisma.transaction.findMany({
  //     where: whereClause,
  //     orderBy: { createdAt: 'desc' },
  //     include: {
  //       wallet: {
  //         include: {
  //           user: {
  //             select: {
  //               fullName: true,
  //               email: true
  //             }
  //           }
  //         }
  //       },
  //       order: {
  //         select: {
  //           id: true,
  //           totalAmount: true
  //         }
  //       }
  //     }
  //   });
  // }
}
