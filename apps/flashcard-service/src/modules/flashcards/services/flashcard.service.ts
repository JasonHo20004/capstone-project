// =============================================================================
// Flashcard Service - Business Logic Layer
// =============================================================================

import { FlashcardRepository } from "../repositories/flashcard.repository.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "@capstone/common";
import { validateEnglishText } from "../../../services/english-validator.service.js";
import { generateTTSAudio } from "../../../services/tts.service.js";
import type {
  CreateDeckInput,
  UpdateDeckInput,
  ListDecksQuery,
  CreateFlashcardInput,
  UpdateFlashcardInput,
  ListFlashcardsQuery,
  DeckResponse,
  FlashcardResponse,
} from "../dtos/flashcard.dto.js";

export class FlashcardService {
  constructor(private readonly repository: FlashcardRepository) {}

  // ============== Tag Operations ==============

  async listTags(search?: string) {
    return await this.repository.listTags(search);
  }

  // ============== Deck Operations ==============

  async createDeck(userId: string, input: CreateDeckInput): Promise<DeckResponse> {
    const deck = await this.repository.createDeck({
      title: input.title,
      description: input.description,
      isPublic: input.isPublic,
      userId,
    });

    // Handle tags if provided
    if (input.tags && input.tags.length > 0) {
      const tags = await this.repository.findOrCreateTags(input.tags);
      await this.repository.setDeckTags(deck.id, tags.map((t) => t.id));
    }

    return this.mapDeckResponse(deck);
  }

  async getDeckById(id: string, userId?: string): Promise<DeckResponse> {
    const deck = await this.repository.findDeckById(id);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    // Check access: must be public or owned by user
    if (!deck.isPublic && deck.userId !== userId) {
      throw new ForbiddenError("You don't have access to this deck");
    }

    return this.mapDeckResponse(deck);
  }

  async listDecks(query: ListDecksQuery, userId?: string) {
    // If not filtering by specific user and not explicitly requesting public,
    // show public decks + user's own decks
    const result = await this.repository.findDecks({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      tag: query.tag,
      userId: query.userId,
      isPublic: query.isPublic,
    });

    return {
      data: result.data.map((d) => this.mapDeckResponse(d)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async updateDeck(id: string, userId: string, input: UpdateDeckInput): Promise<DeckResponse> {
    const deck = await this.repository.findDeckById(id);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenError("You can only update your own decks");
    }

    const updated = await this.repository.updateDeck(id, {
      title: input.title,
      description: input.description,
      isPublic: input.isPublic,
    });

    // Update tags if provided
    if (input.tags !== undefined) {
      const tags = input.tags.length > 0
        ? await this.repository.findOrCreateTags(input.tags)
        : [];
      await this.repository.setDeckTags(id, tags.map((t) => t.id));
    }

    return this.mapDeckResponse(updated);
  }

  async deleteDeck(id: string, userId: string): Promise<void> {
    const deck = await this.repository.findDeckById(id);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenError("You can only delete your own decks");
    }

    await this.repository.deleteDeck(id);
  }

  // ============== Flashcard Operations ==============

  async createFlashcard(deckId: string, userId: string, input: CreateFlashcardInput): Promise<FlashcardResponse> {
    const deck = await this.repository.findDeckById(deckId);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenError("You can only add cards to your own decks");
    }

    // Validate English word/phrase (skip if audioUrl already provided)
    if (!input.audioUrl && input.frontContent) {
      const validation = await validateEnglishText(input.frontContent);
      if (!validation.valid) {
        throw new BadRequestError(validation.reason || "Invalid English text");
      }
    }

    // Auto-generate TTS audio if not provided
    let audioUrl = input.audioUrl;
    if (!audioUrl && input.frontContent) {
      audioUrl = await generateTTSAudio(input.frontContent) ?? undefined;
    }

    const flashcard = await this.repository.createFlashcard({
      ...input,
      audioUrl,
      deckId,
    });

    return flashcard;
  }

  async getFlashcardByCardId(cardId: string, userId?: string): Promise<{ deckId: string } | null> {
    const flashcard = await this.repository.findFlashcardById(cardId);
    if (!flashcard) return null;
    const deck = await this.repository.findDeckById(flashcard.deckId);
    if (!deck || (!deck.isPublic && deck.userId !== userId)) return null;
    return { deckId: flashcard.deckId };
  }

  async getFlashcard(deckId: string, id: string, userId?: string): Promise<FlashcardResponse> {
    const deck = await this.repository.findDeckById(deckId);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (!deck.isPublic && deck.userId !== userId) {
      throw new ForbiddenError("You don't have access to this deck");
    }

    const flashcard = await this.repository.findFlashcardById(id);

    if (!flashcard || flashcard.deckId !== deckId) {
      throw new NotFoundError("Flashcard not found");
    }

    return flashcard;
  }

  async listFlashcards(deckId: string, query: ListFlashcardsQuery, userId?: string) {
    const deck = await this.repository.findDeckById(deckId);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (!deck.isPublic && deck.userId !== userId) {
      throw new ForbiddenError("You don't have access to this deck");
    }

    return await this.repository.findFlashcardsByDeckId(deckId, {
      page: query.page,
      limit: query.limit,
    });
  }

  async updateFlashcard(deckId: string, id: string, userId: string, input: UpdateFlashcardInput): Promise<FlashcardResponse> {
    const deck = await this.repository.findDeckById(deckId);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenError("You can only update cards in your own decks");
    }

    const flashcard = await this.repository.findFlashcardById(id);

    if (!flashcard || flashcard.deckId !== deckId) {
      throw new NotFoundError("Flashcard not found");
    }

    return await this.repository.updateFlashcard(id, input);
  }

  async deleteFlashcard(deckId: string, id: string, userId: string): Promise<void> {
    const deck = await this.repository.findDeckById(deckId);

    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new ForbiddenError("You can only delete cards from your own decks");
    }

    const flashcard = await this.repository.findFlashcardById(id);

    if (!flashcard || flashcard.deckId !== deckId) {
      throw new NotFoundError("Flashcard not found");
    }

    await this.repository.deleteFlashcard(id);
  }

  // ============== Spaced Repetition (SM-2 Algorithm) ==============

  async updateProgress(userId: string, flashcardId: string, quality: number) {
    if (quality < 0 || quality > 5) {
      throw new BadRequestError("Quality must be between 0 and 5");
    }

    const flashcard = await this.repository.findFlashcardById(flashcardId);
    if (!flashcard) {
      throw new NotFoundError("Flashcard not found");
    }

    // Get existing progress or create default
    const existingProgress = await this.repository.findUserProgress(userId, flashcardId);

    const {
      repetitions = 0,
      easeFactor = 2.5,
      interval = 0,
      learningStep = 0,
    } = existingProgress || {};

    // SM-2 Algorithm implementation
    let newRepetitions = repetitions;
    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newLearningStep = learningStep;
    let status: "LEARNING" | "REVIEW" = "LEARNING";

    if (quality >= 3) {
      // Correct response
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      newRepetitions = repetitions + 1;
      status = "REVIEW";
    } else {
      // Incorrect response - reset
      newRepetitions = 0;
      newInterval = 1;
      newLearningStep = 0;
      status = "LEARNING";
    }

    // Update ease factor
    newEaseFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

    return await this.repository.upsertUserProgress({
      userId,
      flashcardId,
      status,
      nextReviewAt,
      repetitions: newRepetitions,
      easeFactor: newEaseFactor,
      interval: newInterval,
      learningStep: newLearningStep,
    });
  }

  async resetProgressByDeck(deckId: string, userId: string) {
    const deck = await this.repository.findDeckById(deckId);
    if (!deck) {
      throw new NotFoundError("Deck not found");
    }
    return await this.repository.resetProgressByDeck(deckId, userId);
  }

  async getReviewCards(userId: string, limit: number) {
    const dueCards = await this.repository.findDueCards(userId, limit);

    const remaining = limit - dueCards.length;
    let newCards: any[] = [];
    if (remaining > 0) {
      newCards = await this.repository.findNewCards(userId, remaining);
    }

    return {
      dueCards: dueCards.map((p) => ({
        ...p.flashcard,
        progress: {
          status: p.status,
          nextReviewAt: p.nextReviewAt,
          repetitions: p.repetitions,
          easeFactor: p.easeFactor,
          interval: p.interval,
        },
      })),
      newCards,
    };
  }

  /** Get review queue for a specific deck (flat array for frontend StudyMode) */
  async getReviewQueueByDeck(userId: string, deckId: string, limit: number = 50) {
    const dueCards = await this.repository.findDueCards(userId, limit, deckId);
    const remaining = limit - dueCards.length;
    let newCards: any[] = [];
    if (remaining > 0) {
      newCards = await this.repository.findNewCards(userId, remaining, deckId);
    }

    const dueCardsWithProgress = dueCards.map((p) => ({
      ...p.flashcard,
      queueType: p.status,
      progress: {
        status: p.status,
        nextReviewAt: p.nextReviewAt,
        repetitions: p.repetitions,
        easeFactor: p.easeFactor,
        interval: p.interval,
      },
    }));
    const newCardsWithType = newCards.map((c) => ({ ...c, queueType: "NEW" }));

    return [...dueCardsWithProgress, ...newCardsWithType];
  }

  // ============== Helper Methods ==============

  private mapDeckResponse(deck: any, flashcardCount?: number): DeckResponse {
    return {
      id: deck.id,
      title: deck.title,
      description: deck.description,
      isPublic: deck.isPublic,
      userId: deck.userId,
      createdAt: deck.createdAt,
      tags: deck.deckTags?.map((dt: any) => dt.tag.name) || [],
      flashcardCount: flashcardCount ?? 0,
    };
  }
}
