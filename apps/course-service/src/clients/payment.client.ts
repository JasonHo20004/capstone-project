// =============================================================================
// Payment Client - HTTP client to communicate with Payment Service
// =============================================================================

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

export interface SellerTransaction {
  month: number;
  grossAmount: number;
  platformFee: number;
}

export interface WithdrawalResult {
  withdrawalRequestId: string;
}

export interface SellerFinancialSummary {
  totalEarnings: number;
  totalPending: number;
  allowance: number;
  pendingBalance: number;
  pendingWithdrawalCount: number;
  pendingWithdrawalTotal: number;
  thisMonthNet: number;
  prevMonthNet: number;
}

export class PaymentClient {
  private static instance: PaymentClient;

  public static getInstance(): PaymentClient {
    if (!PaymentClient.instance) {
      PaymentClient.instance = new PaymentClient();
    }
    return PaymentClient.instance;
  }

  async getSellerTransactions(sellerId: string, year: number): Promise<SellerTransaction[]> {
    try {
      const response = await fetch(
        `${PAYMENT_SERVICE_URL}/api/payments/internal/seller/${sellerId}/transactions?year=${year}`,
        { headers: { "x-internal-service": "course-service" } }
      );
      if (!response.ok) return [];
      const data = await response.json() as { data: SellerTransaction[] };
      return data.data || [];
    } catch (error) {
      console.error("[Course Service] Error fetching seller transactions:", error);
      return [];
    }
  }

  async requestWithdrawal(sellerId: string, amount: number): Promise<WithdrawalResult> {
    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/internal/seller/withdrawal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-service": "course-service",
        },
        body: JSON.stringify({ sellerId, amount }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error || `Withdrawal request failed: ${response.status}`);
    }

    const data = await response.json() as { data: WithdrawalResult };
    return data.data;
  }

  /**
   * Reverse all seller earnings tied to a course and refund every buyer.
   * Called when admin moves a course to REFUSE/INACTIVE.
   */
  async refundCourse(
    courseId: string,
    reason?: string
  ): Promise<{ refunded: number; totalRefunded: number; buyers: number }> {
    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/commission/internal/refund-course/${courseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-service": "course-service",
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || `refundCourse failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      data: { refunded: number; totalRefunded: number; buyers: number };
    };
    return data.data;
  }

  /**
   * Compact financial snapshot for the seller dashboard.
   * Returns null on transport error so the dashboard can degrade gracefully.
   */
  async getSellerFinancialSummary(sellerId: string): Promise<SellerFinancialSummary | null> {
    try {
      const response = await fetch(
        `${PAYMENT_SERVICE_URL}/api/commission/internal/seller/${sellerId}/financial-summary`,
        { headers: { "x-internal-service": "course-service" } }
      );
      if (!response.ok) return null;
      const data = (await response.json()) as { data: SellerFinancialSummary };
      return data.data;
    } catch (err) {
      console.error("[Course Service] Error fetching financial summary:", err);
      return null;
    }
  }
}

export const paymentClient = PaymentClient.getInstance();
