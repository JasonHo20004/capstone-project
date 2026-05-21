// =============================================================================
// Identity Client - Used by payment-service to verify seller status
// before destructive money actions (e.g. withdrawal).
// =============================================================================

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || "http://localhost:3001";

export async function getSellerStatus(
  userId: string
): Promise<{ hasProfile: boolean; active: boolean } | null> {
  try {
    const res = await fetch(
      `${IDENTITY_SERVICE_URL}/api/users/internal/${userId}/seller-status`
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data: { hasProfile: boolean; active: boolean } };
    return json.data;
  } catch (err) {
    console.error("[Payment Service] Error fetching seller status:", err);
    return null;
  }
}
