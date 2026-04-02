// =============================================================================
// Flashcard Controller - HTTP Handlers
// =============================================================================

import { Request, Response } from "express";
import { FlashcardService } from "../services/flashcard.service.js";
import { FlashcardRepository } from "../repositories/flashcard.repository.js";
import { asyncHandler } from "@capstone/common";

export class FlashcardController {
  private service: FlashcardService;

  constructor() {
    this.service = new FlashcardService(new FlashcardRepository());
  }

  // ============== Tag Endpoints ==============

  listTags = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const tags = await this.service.listTags(search);

    res.json({ success: true, data: tags });
  });

  // ============== Deck Endpoints ==============

  createDeck = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const deck = await this.service.createDeck(userId, req.body);

    res.status(201).json({
      success: true,
      data: deck,
      message: "Deck created successfully",
    });
  });

  getDeck = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const deck = await this.service.getDeckById(id as string, userId);

    res.json({ success: true, data: deck });
  });

  listDecks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await this.service.listDecks(req.query as any, userId);

    res.json({ success: true, ...result });
  });

  updateDeck = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const deck = await this.service.updateDeck(id as string, userId, req.body);

    res.json({
      success: true,
      data: deck,
      message: "Deck updated successfully",
    });
  });

  deleteDeck = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    await this.service.deleteDeck(id as string, userId);

    res.json({ success: true, message: "Deck deleted successfully" });
  });

  // ============== Flashcard Endpoints ==============

  createFlashcard = asyncHandler(async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const userId = req.user!.userId;
    const flashcard = await this.service.createFlashcard(deckId as string, userId, req.body);

    res.status(201).json({
      success: true,
      data: flashcard,
      message: "Flashcard created successfully",
    });
  });

  getFlashcard = asyncHandler(async (req: Request, res: Response) => {
    const { deckId, id } = req.params;
    const userId = req.user?.userId;
    const flashcard = await this.service.getFlashcard(deckId as string, id as string, userId);

    res.json({ success: true, data: flashcard });
  });

  listFlashcards = asyncHandler(async (req: Request, res: Response) => {
    const { deckId } = req.params;
    const userId = req.user?.userId;
    const result = await this.service.listFlashcards(deckId as string, req.query as any, userId);

    res.json({ success: true, ...result });
  });

  updateFlashcard = asyncHandler(async (req: Request, res: Response) => {
    const { deckId, id } = req.params;
    const userId = req.user!.userId;
    const flashcard = await this.service.updateFlashcard(deckId as string, id as string, userId, req.body);

    res.json({
      success: true,
      data: flashcard,
      message: "Flashcard updated successfully",
    });
  });

  deleteFlashcard = asyncHandler(async (req: Request, res: Response) => {
    const { deckId, id } = req.params;
    const userId = req.user!.userId;
    await this.service.deleteFlashcard(deckId as string, id as string, userId);

    res.json({ success: true, message: "Flashcard deleted successfully" });
  });

  createFlashcardFromBody = asyncHandler(async (req: Request, res: Response) => {
    const { deckId, ...body } = req.body;
    if (!deckId) throw new Error("deckId is required");
    req.params = { deckId };
    req.body = body;
    return this.createFlashcard(req, res);
  });

  updateFlashcardByCardId = asyncHandler(async (req: Request, res: Response) => {
    const { id: cardId } = req.params;
    const flashcard = await this.service.getFlashcardByCardId(cardId as string, req.user?.userId);
    if (!flashcard) throw new Error("Flashcard not found");
    req.params = { deckId: flashcard.deckId, id: cardId };
    return this.updateFlashcard(req, res);
  });

  deleteFlashcardByCardId = asyncHandler(async (req: Request, res: Response) => {
    const { id: cardId } = req.params;
    const flashcard = await this.service.getFlashcardByCardId(cardId as string, req.user?.userId);
    if (!flashcard) throw new Error("Flashcard not found");
    req.params = { deckId: flashcard.deckId, id: cardId };
    return this.deleteFlashcard(req, res);
  });

  // ============== Progress/Review Endpoints ==============

  updateProgress = asyncHandler(async (req: Request, res: Response) => {
    const { flashcardId } = req.params;
    const userId = req.user!.userId;
    const { quality } = req.body;

    const progress = await this.service.updateProgress(userId, flashcardId as string, quality);

    res.json({
      success: true,
      data: progress,
      message: "Progress updated successfully",
    });
  });

  getReviewCards = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    const cards = await this.service.getReviewCards(userId, limit);

    res.json({ success: true, data: cards });
  });

  getReviewQueue = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { deckId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const cards = await this.service.getReviewQueueByDeck(userId, deckId as string, limit);

    res.json({ success: true, data: cards });
  });

  resetProgressByDeck = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { deckId } = req.params;

    await this.service.resetProgressByDeck(deckId as string, userId);

    res.json({ success: true, message: "Progress reset successfully" });
  });
}
