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
}

export const paymentClient = PaymentClient.getInstance();
