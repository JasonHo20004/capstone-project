// =============================================================================
// Identity Client — notification-service uses this to resolve campaign
// recipient lists (by role) before fanning out bulk notifications.
// =============================================================================

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || "http://localhost:3001";

export interface UserBasicInfo {
  id: string;
  email: string;
  fullName: string;
  role: string;
  profilePicture?: string | null;
}

/**
 * Resolve a single user's basic info (incl. email) by id — used to email a
 * user when an event only carries their userId (e.g. withdrawal approved).
 * Returns null on any failure so callers can fall back to in-app only.
 */
export async function getUserBasicInfo(userId: string): Promise<UserBasicInfo | null> {
  try {
    const res = await fetch(`${IDENTITY_SERVICE_URL}/api/users/internal/${userId}`);
    if (!res.ok) {
      console.error(
        "[Notification Service] getUserBasicInfo failed:",
        res.status,
        await res.text()
      );
      return null;
    }
    const json = (await res.json()) as { data: UserBasicInfo | null };
    return json.data ?? null;
  } catch (err) {
    console.error("[Notification Service] getUserBasicInfo error:", err);
    return null;
  }
}

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
