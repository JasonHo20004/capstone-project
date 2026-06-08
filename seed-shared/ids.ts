// =============================================================================
// Demo Seed — Deterministic ID Registry
// -----------------------------------------------------------------------------
// Single source of truth for every UUID used by the demo dataset.
//
// IDs are derived with UUIDv5 (SHA-1, RFC 4122) from a fixed namespace plus a
// stable string key. This guarantees that calling `id('user', 'linh')` returns
// the *exact same* UUID in every one of the 7 service databases — which is the
// only thing that makes cross-service rows (orders ↔ courses ↔ users ↔ tests)
// actually join, since there are no DB-level foreign keys across schemas.
//
// Dependency-free on purpose (uses Node's built-in crypto) so it imports
// cleanly from any service package without touching node_modules resolution.
// =============================================================================

import { createHash } from "node:crypto";

// Fixed namespace UUID for the whole demo dataset. Changing this regenerates
// every ID (and would orphan previously-seeded rows), so leave it alone.
const DEMO_NAMESPACE = "b6f3a2c0-1d4e-5f6a-8b9c-0d1e2f3a4b5c";

function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/-/g, "");
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return bytes;
}

/**
 * RFC 4122 UUIDv5 (name-based, SHA-1). Deterministic: same input → same UUID.
 */
export function uuidv5(name: string, namespace: string = DEMO_NAMESPACE): string {
  const nsBytes = hexToBytes(namespace);
  const nameBytes = Buffer.from(name, "utf8");
  const hash = createHash("sha1")
    .update(Buffer.from(nsBytes))
    .update(nameBytes)
    .digest();

  const bytes = Array.from(hash.subarray(0, 16));
  // Version 5
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  // RFC 4122 variant
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.map((b) => b.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

/**
 * Namespaced deterministic ID. `kind` keeps different entity families from
 * colliding even if they share a key (e.g. a user 'linh' and a course 'linh').
 */
export function id(kind: string, key: string | number): string {
  return uuidv5(`${kind}:${key}`);
}

// Convenience helpers per entity family — pure sugar over id().
export const userId = (key: string) => id("user", key);
export const courseId = (key: string) => id("course", key);
export const moduleId = (key: string) => id("module", key);
export const lessonId = (key: string) => id("lesson", key);
export const testId = (key: string) => id("test", key);
export const sectionId = (key: string) => id("section", key);
export const passageId = (key: string) => id("passage", key);
export const questionId = (key: string) => id("question", key);
export const orderId = (key: string) => id("order", key);
export const deckId = (key: string) => id("deck", key);
export const flashcardId = (key: string) => id("flashcard", key);
export const couponId = (key: string) => id("coupon", key);
export const practiceSessionId = (key: string) => id("practiceSession", key);
export const speakingTopicId = (key: string) => id("speakingTopic", key);
export const planId = (key: string) => id("plan", key);
