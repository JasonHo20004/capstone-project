// =============================================================================
// Identity Client — notification-service uses this to resolve campaign
// recipient lists (by role) before fanning out bulk notifications.
// =============================================================================

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || "http://localhost:3001";

export async function listUserIdsByRoles(roles: string[]): Promise<string[]> {
  try {
    const res = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/by-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roles }),
    });
    if (!res.ok) {
      console.error(
        "[Notification Service] listUserIdsByRoles failed:",
        res.status,
        await res.text()
      );
      return [];
    }
    const json = (await res.json()) as { data: string[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("[Notification Service] listUserIdsByRoles error:", err);
    return [];
  }
}
