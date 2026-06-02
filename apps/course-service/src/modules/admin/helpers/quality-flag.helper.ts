// =============================================================================
// Quality-Flag Helper
//
// The "course quality flag" lifecycle is stored entirely as rows in the
// existing CourseReviewHistory table (no schema changes). Each action is one
// append-only row whose `reason` column carries a marker prefix:
//
//   QF_OPEN|<reason>   admin flagged an ACTIVE course "Chưa đạt yêu cầu"
//   QF_CONFIRMED       admin recorded the seller's fix confirmation (timer off)
//   QF_CLEARED         admin removed the flag (course passed)
//   QF_AUTODRAFT|...   48h elapsed without confirmation → system reverted to DRAFT
//
// The course stays ACTIVE while flagged; only QF_AUTODRAFT is a real ACTIVE→DRAFT
// transition. This keeps the full audit trail (who/when) for free via actorId
// + createdAt on each row.
// =============================================================================

/** Marker prefixes written into CourseReviewHistory.reason. */
export const QF = {
  OPEN: "QF_OPEN",
  CONFIRMED: "QF_CONFIRMED",
  CLEARED: "QF_CLEARED",
  AUTODRAFT: "QF_AUTODRAFT",
} as const;

/** 48 hours, in milliseconds. Lower this temporarily to exercise the sweeper. */
export const FLAG_TTL_MS = 48 * 60 * 60 * 1000;

/** Shape of a CourseReviewHistory row (only the fields we read). */
export interface ReviewHistoryRow {
  reason: string | null;
  actorId: string;
  createdAt: Date;
}

/** Derived view of a course's current quality flag, returned to the admin UI. */
export interface QualityFlagView {
  reason: string;
  flaggedById: string;
  flaggedAt: Date;
  deadlineAt: Date;
  confirmed: boolean;
}

function hasMarker(reason: string | null, marker: string): boolean {
  return typeof reason === "string" && reason.startsWith(marker);
}

function extractReason(reason: string | null): string {
  // Stored as "QF_OPEN|<reason text>"; strip the marker + delimiter.
  if (typeof reason !== "string") return "";
  const idx = reason.indexOf("|");
  return idx >= 0 ? reason.slice(idx + 1) : "";
}

/**
 * Derive the current active quality flag from a course's review-history rows.
 * Returns null when there is no active flag.
 *
 * @param rows All CourseReviewHistory rows for the course (any order).
 */
export function deriveQualityFlag(rows: ReviewHistoryRow[]): QualityFlagView | null {
  // Newest first so we can find the latest QF_OPEN.
  const sorted = [...rows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const openRow = sorted.find((r) => hasMarker(r.reason, QF.OPEN));
  if (!openRow) return null;

  const openedAt = new Date(openRow.createdAt).getTime();
  const after = (r: ReviewHistoryRow) => new Date(r.createdAt).getTime() > openedAt;

  // A clear/auto-draft after the open row closes the flag.
  const closed = sorted.some(
    (r) => after(r) && (hasMarker(r.reason, QF.CLEARED) || hasMarker(r.reason, QF.AUTODRAFT))
  );
  if (closed) return null;

  const confirmed = sorted.some((r) => after(r) && hasMarker(r.reason, QF.CONFIRMED));

  const flaggedAt = new Date(openRow.createdAt);
  return {
    reason: extractReason(openRow.reason),
    flaggedById: openRow.actorId,
    flaggedAt,
    deadlineAt: new Date(flaggedAt.getTime() + FLAG_TTL_MS),
    confirmed,
  };
}
