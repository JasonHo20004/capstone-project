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
      this.repository.getTransactionCount(whereClause),
    ]);

    return {
      transactions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  // Get transaction by ID
  public async getTransactionById(id: string) {
    const transaction = await this.repository.getTransactionById(id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return {
      transaction,
    };
  }

  // // Get transaction statistics
  // public async getTransactionStats(filters: {
  //   startDate?: string;
  //   endDate?: string;
  //   transactionType?: string;
  // }) {
  //   const whereClause = this.repository.buildWhereClause(filters);
  //   const stats = await this.repository.getTransactionStats(whereClause);

  //   return {
  //     totalTransactions: stats.totalTransactions,
  //     successCount: stats.successCount,
  //     pendingCount: stats.pendingCount,
  //     failedCount: stats.failedCount,
  //     totalAmount: Number(stats.totalAmount),
  //     successRate: stats.totalTransactions > 0
  //       ? Number(((stats.successCount / stats.totalTransactions) * 100).toFixed(2))
  //       : 0,
  //     byType: stats.byType.map(t => ({
  //       type: t.type,
  //       count: t.count,
  //       amount: Number(t.amount)
  //     }))
  //   };
  // }

  // // Export transactions
  // public async exportTransactions(filters: {
  //   search?: string;
  //   status?: string;
  //   transactionType?: string;
  //   startDate?: string;
  //   endDate?: string;
  //   walletId?: string;
  // }) {
  //   const whereClause = this.repository.buildWhereClause(filters);
  //   const transactions = await this.repository.getAllTransactionsForExport(whereClause);

  //   return transactions.map(t => ({
  //     'Transaction ID': t.id,
  //     'Amount': Number(t.amount),
  //     'Status': t.status,
  //     'Type': t.transactionType,
  //     'Description': t.description || '',
  //     'Date': t.createdAt.toISOString(),
  //     'User Name': t.wallet.user?.fullName || '',
  //     'User Email': t.wallet.user?.email || '',
  //     'Order ID': t.order?.id || '',
  //     'Order Amount': t.order ? Number(t.order.totalAmount) : ''
  //   }));
  // }
}
