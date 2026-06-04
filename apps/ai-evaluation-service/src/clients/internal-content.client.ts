// =============================================================================
// Internal Content Client — fetch lessons/flashcards/quizzes from sibling services
// to populate Learning Path recommendations.
// =============================================================================

const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || "http://localhost:3002";
const ASSESSMENT_SERVICE_URL = process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3003";
const FLASHCARD_SERVICE_URL = process.env.FLASHCARD_SERVICE_URL || "http://localhost:3004";

export type SkillKey =
  | "Listening"
  | "Reading"
  | "Writing"
  | "Speaking"
  | "Vocabulary"
  | "Grammar";

export interface RecommendedItem {
  id: string;
  title: string;
  type: "Course" | "Lesson" | "Flashcard" | "Quiz" | "Practice Test";
  skill: SkillKey;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  cta: "Start" | "Add to plan" | "Practice";
}

const LEVEL_TO_DIFFICULTY: Record<string, RecommendedItem["difficulty"]> = {
  "Pre-A1": "Beginner",
  A1: "Beginner",
  A2: "Beginner",
  B1: "Intermediate",
  B2: "Intermediate",
  C1: "Advanced",
  C2: "Advanced",
};

function difficultyFromLevel(level: string | null | undefined): RecommendedItem["difficulty"] {
  return (level && LEVEL_TO_DIFFICULTY[level]) || "Intermediate";
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[InternalContent] Fetch failed: ${url}`, e);
    return null;
  }
}

interface CourseListResponse {
  data?: { items?: Array<{ id: string; title: string; level?: string | null }> } | Array<unknown>;
}

interface DeckListResponse {
  data?: { items?: Array<{ id: string; title: string; tags?: string[] }> } | Array<unknown>;
}

interface TestListResponse {
  data?: { items?: Array<{ id: string; title: string; type?: string; difficulty?: string }> } | Array<unknown>;
}

function asArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as { items?: T[]; data?: { items?: T[] } | T[] };
    if (Array.isArray(obj.items)) return obj.items;
    if (obj.data && Array.isArray(obj.data)) return obj.data as T[];
    if (obj.data && Array.isArray((obj.data as { items?: T[] }).items)) {
      return (obj.data as { items: T[] }).items;
    }
  }
  return [];
}

export class InternalContentClient {
  async fetchRecommendedLessons(
    skill: SkillKey,
    level: string | null,
    limit = 6
  ): Promise<RecommendedItem[]> {
    const url = `${COURSE_SERVICE_URL}/api/courses/published?limit=${limit}`;
    const res = await safeFetchJson<CourseListResponse>(url);
    const rows = asArray<{ id: string; title: string; level?: string | null }>(res);
    return rows.slice(0, limit).map((r) => ({
      id: r.id,
      title: r.title,
      type: "Lesson",
      skill,
      estimatedMinutes: 30,
      difficulty: difficultyFromLevel(r.level ?? level),
      cta: "Start",
    }));
  }

  async fetchRecommendedFlashcards(
    skill: SkillKey,
    level: string | null,
    limit = 6
  ): Promise<RecommendedItem[]> {
    const url = `${FLASHCARD_SERVICE_URL}/api/flashcard-decks?limit=${limit}`;
    const res = await safeFetchJson<DeckListResponse>(url);
    const rows = asArray<{ id: string; title: string }>(res);
    return rows.slice(0, limit).map((r) => ({
      id: r.id,
      title: r.title,
      type: "Flashcard",
      skill,
      estimatedMinutes: 15,
      difficulty: difficultyFromLevel(level),
      cta: "Practice",
    }));
  }

  async fetchRecommendedQuizzes(
    skill: SkillKey,
    level: string | null,
    limit = 6
  ): Promise<RecommendedItem[]> {
    const url = `${ASSESSMENT_SERVICE_URL}/api/tests?limit=${limit}`;
    const res = await safeFetchJson<TestListResponse>(url);
    const rows = asArray<{ id: string; title: string; type?: string; difficulty?: string }>(res);
    return rows.slice(0, limit).map((r) => ({
      id: r.id,
      title: r.title,
      type: "Quiz",
      skill,
      estimatedMinutes: 20,
      difficulty:
        (r.difficulty as RecommendedItem["difficulty"]) || difficultyFromLevel(level),
      cta: "Practice",
    }));
  }
}

export const internalContentClient = new InternalContentClient();
