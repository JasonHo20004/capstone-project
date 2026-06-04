// =============================================================================
// AI Advisor — Action Registry (Whitelist validator)
// ALL advisor actions MUST pass through this registry before delivery.
// =============================================================================

export const ADVISOR_ACTION_TYPES = [
  "SHOW_BANNER",
  "SUGGEST_COURSE",
  "UNLOCK_TIP",
  "SEND_REMINDER",
] as const;

export type AdvisorActionType = (typeof ADVISOR_ACTION_TYPES)[number];

export interface AdvisorAction {
  type: AdvisorActionType;
  message: string;       // User-facing message (max 120 chars)
  evidence: string;      // Why AI is suggesting this (e.g., "You scored 40% on Listening in recent quizzes")
  courseId?: string;     // Only for SUGGEST_COURSE — must be a real course ID
  tipId?: string;        // Optional reference ID for UNLOCK_TIP
}

export type TriggerReason =
  | "quiz_failed"
  | "band_gap_detected"
  | "idle_4h"
  | "daily_reminder"
  | "user_request"
  | "writing_evaluated"
  | "speaking_evaluated";

// Validation rules per action type
const ACTION_RULES: Record<AdvisorActionType, (action: AdvisorAction) => string | null> = {
  SHOW_BANNER: (a) => {
    if (!a.message || a.message.length > 120) return "SHOW_BANNER.message must be 1-120 chars";
    if (!a.evidence) return "SHOW_BANNER.evidence is required";
    return null;
  },
  SUGGEST_COURSE: (a) => {
    if (!a.courseId) return "SUGGEST_COURSE requires courseId";
    if (!a.evidence) return "SUGGEST_COURSE.evidence is required";
    return null;
  },
  UNLOCK_TIP: (a) => {
    if (!a.message) return "UNLOCK_TIP.message is required";
    return null;
  },
  SEND_REMINDER: (a) => {
    if (!a.message) return "SEND_REMINDER.message is required";
    if (!a.evidence) return "SEND_REMINDER.evidence is required";
    return null;
  },
};

/**
 * Validates that an AI-generated action is within the allowed whitelist.
 * Throws if invalid — prevents unsanctioned AI behavior.
 */
export function validateAdvisorAction(action: unknown): AdvisorAction {
  if (!action || typeof action !== "object") {
    throw new Error("Action Registry: action must be an object");
  }

  const a = action as Record<string, unknown>;

  if (!ADVISOR_ACTION_TYPES.includes(a.type as AdvisorActionType)) {
    throw new Error(
      `Action Registry: unknown action type "${a.type}". Allowed: ${ADVISOR_ACTION_TYPES.join(", ")}`
    );
  }

  const typed = action as AdvisorAction;
  const rule = ACTION_RULES[typed.type];
  const error = rule(typed);

  if (error) {
    throw new Error(`Action Registry validation failed: ${error}`);
  }

  return typed;
}

/**
 * Checks if enough time has passed since the last push for a user.
 * Prevents AI from spamming the user with proactive actions.
 */
export function isProactiveAllowed(advisorConfig: Record<string, unknown>): boolean {
  if (advisorConfig.proactive_enabled === false) return false;

  const lastPushAt = advisorConfig.last_push_at as string | undefined;
  if (!lastPushAt) return true;

  const minIntervalHours = (advisorConfig.min_interval_hours as number) ?? 4;
  const elapsed = (Date.now() - new Date(lastPushAt).getTime()) / (1000 * 60 * 60);

  return elapsed >= minIntervalHours;
}
