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
}
