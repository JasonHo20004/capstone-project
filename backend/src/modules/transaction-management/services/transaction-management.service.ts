import { TransactionManagementRepository } from "../repositories/transaction-management.repository";

export class TransactionManagementService {
  private repository = new TransactionManagementRepository();

  // Get transactions with filters and pagination
  public async getTransactions(filters: {
    search?: string;
    status?: string;
    transactionType?: string;
    startDate?: string;
    endDate?: string;
    walletId?: string;
    page?: number;
    limit?: number;
  }) {
    const whereClause = this.repository.buildWhereClause(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 50;

    const [transactions, totalCount] = await Promise.all([
      this.repository.getTransactions(whereClause, page, limit),
      this.repository.getTransactionCount(whereClause)
    ]);

    return {
      transactions: transactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        status: t.status,
        transactionType: t.transactionType,
        description: t.description,
        createdAt: t.createdAt,
        wallet: {
          id: t.wallet.id,
          user: t.wallet.user ? {
            id: t.wallet.user.id,
            fullName: t.wallet.user.fullName,
            email: t.wallet.user.email,
            profilePicture: t.wallet.user.profilePicture
          } : null
        },
        order: t.order ? {
          id: t.order.id,
          totalAmount: Number(t.order.totalAmount),
          createdAt: t.order.createdAt
        } : null,
        topupOrder: t.topupOrder ? {
          id: t.topupOrder.id,
          realMoney: Number(t.topupOrder.realMoney),
          paymentMethod: t.topupOrder.paymentMethod
        } : null
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Get transaction by ID
  public async getTransactionById(id: string) {
    const transaction = await this.repository.getTransactionById(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      status: transaction.status,
      transactionType: transaction.transactionType,
      description: transaction.description,
      createdAt: transaction.createdAt,
      wallet: {
        id: transaction.wallet.id,
        allowance: Number(transaction.wallet.allowance),
        user: transaction.wallet.user ? {
          id: transaction.wallet.user.id,
          fullName: transaction.wallet.user.fullName,
          email: transaction.wallet.user.email,
          phoneNumber: transaction.wallet.user.phoneNumber,
          profilePicture: transaction.wallet.user.profilePicture
        } : null
      },
      order: transaction.order ? {
        id: transaction.order.id,
        totalAmount: Number(transaction.order.totalAmount),
        createdAt: transaction.order.createdAt,
        items: transaction.order.cart?.cartItems.map(item => ({
          courseId: item.courseId,
          courseTitle: item.course.title,
          price: Number(item.course.price)
        })) || []
      } : null,
      topupOrder: transaction.topupOrder ? {
        id: transaction.topupOrder.id,
        realMoney: Number(transaction.topupOrder.realMoney),
        realAmount: transaction.topupOrder.realAmount ? Number(transaction.topupOrder.realAmount) : null,
        currency: transaction.topupOrder.currency,
        paymentMethod: transaction.topupOrder.paymentMethod,
        status: transaction.topupOrder.status,
        createdAt: transaction.topupOrder.createdAt
      } : null,
      subscriptionContract: transaction.subscriptionContract ? {
        id: transaction.subscriptionContract.id,
        planName: transaction.subscriptionContract.subscriptionPlan.name,
        monthlyFee: Number(transaction.subscriptionContract.subscriptionPlan.monthlyFee),
        createdAt: transaction.subscriptionContract.createdAt,
        expiresAt: transaction.subscriptionContract.expiresAt
      } : null
    };
  }

  // Get transaction statistics
  public async getTransactionStats(filters: {
    startDate?: string;
    endDate?: string;
    transactionType?: string;
  }) {
    const whereClause = this.repository.buildWhereClause(filters);
    const stats = await this.repository.getTransactionStats(whereClause);

    return {
      totalTransactions: stats.totalTransactions,
      successCount: stats.successCount,
      pendingCount: stats.pendingCount,
      failedCount: stats.failedCount,
      totalAmount: Number(stats.totalAmount),
      successRate: stats.totalTransactions > 0
        ? Number(((stats.successCount / stats.totalTransactions) * 100).toFixed(2))
        : 0,
      byType: stats.byType.map(t => ({
        type: t.type,
        count: t.count,
        amount: Number(t.amount)
      }))
    };
  }

  // Export transactions
  public async exportTransactions(filters: {
    search?: string;
    status?: string;
    transactionType?: string;
    startDate?: string;
    endDate?: string;
    walletId?: string;
  }) {
    const whereClause = this.repository.buildWhereClause(filters);
    const transactions = await this.repository.getAllTransactionsForExport(whereClause);

    return transactions.map(t => ({
      'Transaction ID': t.id,
      'Amount': Number(t.amount),
      'Status': t.status,
      'Type': t.transactionType,
      'Description': t.description || '',
      'Date': t.createdAt.toISOString(),
      'User Name': t.wallet.user?.fullName || '',
      'User Email': t.wallet.user?.email || '',
      'Order ID': t.order?.id || '',
      'Order Amount': t.order ? Number(t.order.totalAmount) : ''
    }));
  }
}
