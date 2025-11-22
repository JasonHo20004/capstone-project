import type { Request, Response } from 'express';
import { TransactionManagementService } from '../services/transaction-management.service';

export class TransactionManagementController {
  private service = new TransactionManagementService();

  // Get all transactions with filters
  public getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, status, transactionType, startDate, endDate, walletId, page, limit } = req.query;

      const filters: any = {
        search: search as string,
        status: status as string,
        transactionType: transactionType as string,
        startDate: startDate as string,
        endDate: endDate as string,
        walletId: walletId as string
      };

      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const data = await this.service.getTransactions(filters);

      res.status(200).json({
        success: true,
        message: 'Lấy danh sách giao dịch thành công',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách giao dịch',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get transaction by ID
  public getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID giao dịch là bắt buộc'
        });
        return;
      }

      const data = await this.service.getTransactionById(id);

      res.status(200).json({
        success: true,
        message: 'Lấy chi tiết giao dịch thành công',
        data
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Transaction not found') {
        res.status(404).json({
          success: false,
          message: 'Giao dịch không tồn tại'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết giao dịch',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get transaction statistics
  public getTransactionStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, transactionType } = req.query;

      const stats = await this.service.getTransactionStats({
        startDate: startDate as string,
        endDate: endDate as string,
        transactionType: transactionType as string
      });

      res.status(200).json({
        success: true,
        message: 'Lấy thống kê giao dịch thành công',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê giao dịch',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Export transactions
  public exportTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, status, transactionType, startDate, endDate, walletId, format } = req.query;

      const data = await this.service.exportTransactions({
        search: search as string,
        status: status as string,
        transactionType: transactionType as string,
        startDate: startDate as string,
        endDate: endDate as string,
        walletId: walletId as string
      });

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(data[0] || {});
        const csvRows = [
          headers.join(','),
          ...data.map(row =>
            headers.map(header =>
              JSON.stringify(row[header as keyof typeof row] || '')
            ).join(',')
          )
        ];
        const csv = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=transactions-export-${new Date().toISOString()}.csv`);
        res.status(200).send(csv);
      } else {
        // Return JSON for Excel processing on frontend
        res.status(200).json({
          success: true,
          message: 'Dữ liệu sẵn sàng để xuất',
          data
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xuất giao dịch',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
