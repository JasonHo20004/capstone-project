// =============================================================================
// Payment Client - HTTP client to communicate with Payment Service
// =============================================================================

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

export interface WalletSummary {
  id: string;
  userId: string;
  allowance: number;
  pendingBalance: number;
}

export class PaymentClient {
  private static instance: PaymentClient;

  public static getInstance(): PaymentClient {
    if (!PaymentClient.instance) {
      PaymentClient.instance = new PaymentClient();
    }
    return PaymentClient.instance;
  }

  // Batch-lookup wallets for a list of user IDs. Returns empty array on transport
  // error so the admin user list still renders if payment-service is down.
  async getWalletsByUserIds(userIds: string[]): Promise<WalletSummary[]> {
    if (userIds.length === 0) return [];
    try {
      const response = await fetch(
        `${PAYMENT_SERVICE_URL}/api/wallet/internal/by-user-ids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-service": "identity-service",
          },
          body: JSON.stringify({ userIds }),
        }
      );
      if (!response.ok) return [];
      const data = (await response.json()) as { data: WalletSummary[] };
      return data.data || [];
    } catch (error) {
      console.error("[Identity Service] Error fetching wallets:", error);
      return [];
    }
  }
}

export const paymentClient = PaymentClient.getInstance();
