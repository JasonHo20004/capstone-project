import type { Request, Response } from "express";
import type { GetRevenueOverviewInput } from "../dtos/revenue.dto";
import { RevenueService } from "../services/revenue.service";

export class RevenueController {
  private revenueService = new RevenueService();

  public getRevenueOverview = async (
    req: Request<{}, {}, {}, GetRevenueOverviewInput["query"]>,
    res: Response
  ): Promise<void> => {
    try {
      const { period, startDate, endDate, transactionType, limit, page } =
        req.query;
      const revenueData = await this.revenueService.getRevenueOverview(
        period as string,
        startDate as string,
        endDate as string,
        transactionType as string,
        parseInt(limit?.toString() || "50", 10),
        parseInt(page?.toString() || "1", 10)
      );

      res.status(200).json({
        success: true,
        message: "Revenue overview retrieved successfully",
        data: revenueData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve revenue overview",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // Get complete revenue data (stats + chart + transactions)
  public getRevenueData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, period, transactionType, page, limit } = req.query;

      const filters: any = {
        startDate: startDate as string,
        endDate: endDate as string,
        period: period as string,
        transactionType: transactionType as string
      };

      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const data = await this.revenueService.getRevenueData(filters);
      console.log("filters::::", filters);
      console.log("data:::::", data);

      res.status(200).json({
        success: true,
        message: 'Get revenue data successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get revenue data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get revenue stats only
  public getRevenueStatsOnly = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, period, transactionType } = req.query;

      const stats = await this.revenueService.getRevenueStats({
        startDate: startDate as string,
        endDate: endDate as string,
        period: period as string,
        transactionType: transactionType as string
      });

      res.status(200).json({
        success: true,
        message: 'Get revenue stats successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get revenue stats',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Get transactions list
  public getTransactionsList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, period, transactionType, page, limit } = req.query;

      const filters: any = {
        startDate: startDate as string,
        endDate: endDate as string,
        period: period as string,
        transactionType: transactionType as string
      };

      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const data = await this.revenueService.getTransactionsList(filters);

      res.status(200).json({
        success: true,
        message: 'Get transactions list successfully',
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get transactions list',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Export revenue data
  public exportRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, period, transactionType, format } = req.query;

      const data = await this.revenueService.getTransactionsForExport({
        startDate: startDate as string,
        endDate: endDate as string,
        period: period as string,
        transactionType: transactionType as string
      });

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(data[0] || {});
        const csvRows = [
          headers.join(','),
          ...data.map(row => headers.map(header => JSON.stringify(row[header as keyof typeof row] || '')).join(','))
        ];
        const csv = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=revenue-export-${new Date().toISOString()}.csv`);
        res.status(200).send(csv);
      } else {
        // Return JSON for Excel processing on frontend
        res.status(200).json({
          success: true,
          message: 'Export data ready',
          data
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export revenue data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
