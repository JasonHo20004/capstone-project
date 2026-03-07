// =============================================================================
// Flashcard DTOs - Data Transfer Objects with Zod Validation
// =============================================================================

import { z } from "zod";

// ============== Flashcard Deck DTOs ==============

export const createDeckSchema = {
  body: z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().optional(),
    isPublic: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
  }),
};

export const updateDeckSchema = {
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const getDeckSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const listDecksSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    tag: z.string().optional(),
    userId: z.string().uuid().optional(),
    isPublic: z.coerce.boolean().optional(),
  }),
};

// ============== Flashcard DTOs ==============

export const createFlashcardSchema = {
  body: z.object({
    frontContent: z.string().min(1, "Front content is required"),
    backContent: z.string().min(1, "Back content is required"),
    exampleSentence: z.string().optional(),
    audioUrl: z.string().url().optional(),
  }),
  params: z.object({
    deckId: z.string().uuid(),
  }),
};

export const createFlashcardFromBodySchema = {
  body: z.object({
    deckId: z.string().uuid(),
    frontContent: z.string().min(1, "Front content is required"),
    backContent: z.string().min(1, "Back content is required"),
    exampleSentence: z.string().optional(),
    audioUrl: z.string().url().optional(),
  }),
};

export const updateFlashcardSchema = {
  body: z.object({
    frontContent: z.string().min(1).optional(),
    backContent: z.string().min(1).optional(),
    exampleSentence: z.string().optional(),
    audioUrl: z.string().url().optional(),
  }),
  params: z.object({
    deckId: z.string().uuid(),
    id: z.string().uuid(),
  }),
};

export const getFlashcardSchema = {
  params: z.object({
    deckId: z.string().uuid(),
    id: z.string().uuid(),
  }),
};

export const flashcardIdParamSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const listFlashcardsSchema = {
  params: z.object({
    deckId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
};

// ============== User Progress DTOs ==============

export const updateProgressSchema = {
  body: z.object({
    quality: z.number().int().min(0).max(5), // SM-2 algorithm quality rating
  }),
  params: z.object({
    flashcardId: z.string().uuid(),
  }),
};

export const getReviewCardsSchema = {
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
};

export const getReviewQueueSchema = {
  params: z.object({
    deckId: z.string().uuid(),
  }),
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).default(50),
  }),
};

// ============== Type Exports ==============

export type CreateDeckInput = z.infer<typeof createDeckSchema.body>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema.body>;
export type ListDecksQuery = z.infer<typeof listDecksSchema.query>;

export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema.body>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardSchema.body>;
export type ListFlashcardsQuery = z.infer<typeof listFlashcardsSchema.query>;

export type UpdateProgressInput = z.infer<typeof updateProgressSchema.body>;
export type GetReviewCardsQuery = z.infer<typeof getReviewCardsSchema.query>;

// ============== Response Interfaces ==============

export interface DeckResponse {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  tags: string[];
  flashcardCount?: number;
}

export interface FlashcardResponse {
  id: string;
  frontContent: string;
  backContent: string;
  exampleSentence: string | null;
  audioUrl: string | null;
  deckId: string;
}

export interface ProgressResponse {
  userId: string;
  flashcardId: string;
  status: string;
  nextReviewAt: Date;
  repetitions: number;
  easeFactor: number;
  interval: number;
  learningStep: number;
}
