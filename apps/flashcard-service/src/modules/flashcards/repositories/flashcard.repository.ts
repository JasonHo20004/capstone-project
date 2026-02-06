// =============================================================================
// Flashcard Repository - Database Operations
// =============================================================================

import { PrismaClient, Prisma } from "../../../../generated/prisma/index.js";
import { databaseService } from "../../../services/index.js";

export class FlashcardRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || databaseService.getClient();
  }

  // ============== Deck Operations ==============

  async createDeck(data: {
    title: string;
    description?: string;
    isPublic?: boolean;
    userId: string;
  }) {
    return await this.prisma.flashcardDeck.create({
      data: {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic ?? true,
        userId: data.userId,
      },
      include: {
        deckTags: { include: { tag: true } },
      },
    });
  }

  async findDeckById(id: string) {
    return await this.prisma.flashcardDeck.findUnique({
      where: { id },
      include: {
        deckTags: { include: { tag: true } },
      },
    });
  }

  async countFlashcardsInDeck(deckId: string): Promise<number> {
    return await this.prisma.flashcard.count({
      where: { deckId },
    });
  }

  async findDecks(options: {
    page: number;
    limit: number;
    search?: string;
    tag?: string;
    userId?: string;
    isPublic?: boolean;
  }) {
    const where: Prisma.FlashcardDeckWhereInput = {};

    if (options.userId) {
      where.userId = options.userId;
    }

    if (options.isPublic !== undefined) {
      where.isPublic = options.isPublic;
    }

    if (options.search) {
      where.title = { contains: options.search, mode: "insensitive" };
    }

    const [decks, total] = await Promise.all([
      this.prisma.flashcardDeck.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: { createdAt: "desc" },
        include: {
          deckTags: { include: { tag: true } },
        },
      }),
      this.prisma.flashcardDeck.count({ where }),
    ]);

    return {
      data: decks,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async updateDeck(id: string, data: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  }) {
    return await this.prisma.flashcardDeck.update({
      where: { id },
      data,
      include: {
        deckTags: { include: { tag: true } },
      },
    });
  }

  async deleteDeck(id: string) {
    return await this.prisma.flashcardDeck.delete({
      where: { id },
    });
  }

  // ============== Flashcard Operations ==============

  async createFlashcard(data: {
    frontContent: string;
    backContent: string;
    exampleSentence?: string;
    audioUrl?: string;
    deckId: string;
  }) {
    return await this.prisma.flashcard.create({
      data,
    });
  }

  async findFlashcardById(id: string) {
    return await this.prisma.flashcard.findUnique({
      where: { id },
    });
  }

  async findFlashcardsByDeckId(deckId: string, options: { page: number; limit: number }) {
    const [flashcards, total] = await Promise.all([
      this.prisma.flashcard.findMany({
        where: { deckId },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      this.prisma.flashcard.count({ where: { deckId } }),
    ]);

    return {
      data: flashcards,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async updateFlashcard(id: string, data: {
    frontContent?: string;
    backContent?: string;
    exampleSentence?: string;
    audioUrl?: string;
  }) {
    return await this.prisma.flashcard.update({
      where: { id },
      data,
    });
  }

  async deleteFlashcard(id: string) {
    return await this.prisma.flashcard.delete({
      where: { id },
    });
  }

  // ============== Tag Operations ==============

  async findOrCreateTags(tagNames: string[]) {
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        return await this.prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      })
    );
    return tags;
  }

  async setDeckTags(deckId: string, tagIds: string[]) {
    // Remove existing tags
    await this.prisma.deckTag.deleteMany({ where: { deckId } });

    // Add new tags
    if (tagIds.length > 0) {
      await this.prisma.deckTag.createMany({
        data: tagIds.map((tagId) => ({ deckId, tagId })),
      });
    }
  }

  // ============== User Progress Operations ==============

  async findUserProgress(userId: string, flashcardId: string) {
    return await this.prisma.userFlashcardProgress.findUnique({
      where: { userId_flashcardId: { userId, flashcardId } },
    });
  }

  async upsertUserProgress(data: {
    userId: string;
    flashcardId: string;
    status?: "LEARNING" | "REVIEW";
    nextReviewAt: Date;
    repetitions: number;
    easeFactor: number;
    interval: number;
    learningStep: number;
  }) {
    return await this.prisma.userFlashcardProgress.upsert({
      where: {
        userId_flashcardId: { userId: data.userId, flashcardId: data.flashcardId },
      },
      create: data,
      update: {
        status: data.status,
        nextReviewAt: data.nextReviewAt,
        repetitions: data.repetitions,
        easeFactor: data.easeFactor,
        interval: data.interval,
        learningStep: data.learningStep,
      },
    });
  }

  async findDueCards(userId: string, limit: number) {
    return await this.prisma.userFlashcardProgress.findMany({
      where: {
        userId,
        nextReviewAt: { lte: new Date() },
      },
      take: limit,
      orderBy: { nextReviewAt: "asc" },
      include: {
        flashcard: {
          include: { deck: true },
        },
      },
    });
  }

  async findNewCards(userId: string, limit: number) {
    // Find flashcards that user hasn't started learning yet
    const existingProgressIds = await this.prisma.userFlashcardProgress.findMany({
      where: { userId },
      select: { flashcardId: true },
    });

    const excludeIds = existingProgressIds.map((p) => p.flashcardId);

    return await this.prisma.flashcard.findMany({
      where: {
        id: { notIn: excludeIds },
        deck: { isPublic: true },
      },
      take: limit,
      include: { deck: true },
    });
  }
}
