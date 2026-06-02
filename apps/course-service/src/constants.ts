export const SERVICE_NAME = "course-service";

/**
 * Sentinel UUID used as `actorId` for system-driven CourseReviewHistory rows
 * (e.g. the 48h quality-flag auto-draft). The column is a non-null Uuid, so we
 * need a stable placeholder rather than a real user id.
 */
export const SYSTEM_ACTOR_ID = "00000000-0000-0000-0000-000000000000";
