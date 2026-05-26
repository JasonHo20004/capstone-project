// =============================================================================
// Flashcard Routes - Express Router Configuration
// =============================================================================

import { Router } from "express";
import { z } from "zod";
import { FlashcardController } from "../controllers/flashcard.controller.js";
import { authenticateToken, optionalAuth, requireAdmin, validate } from "@capstone/common";
import {
  createDeckSchema,
  updateDeckSchema,
  getDeckSchema,
  listDecksSchema,
  createFlashcardSchema,
  createFlashcardFromBodySchema,
  updateFlashcardSchema,
  getFlashcardSchema,
  flashcardIdParamSchema,
  listFlashcardsSchema,
  updateProgressSchema,
  getReviewCardsSchema,
  getReviewQueueSchema,
  createTagSchema,
  updateTagSchema,
  tagIdParamSchema,
} from "../dtos/flashcard.dto.js";

const controller = new FlashcardController();

// ============== Deck Router (mounted at /api/flashcard-decks) ==============
export const deckRouter: Router = Router();

deckRouter.get("/", optionalAuth, validate(listDecksSchema), controller.listDecks);
deckRouter.get("/:id", optionalAuth, validate(getDeckSchema), controller.getDeck);
deckRouter.post("/", authenticateToken, validate(createDeckSchema), controller.createDeck);
deckRouter.post("/create", authenticateToken, validate(createDeckSchema), controller.createDeck);
deckRouter.patch("/:id", authenticateToken, validate(updateDeckSchema), controller.updateDeck);
deckRouter.put("/update/:id", authenticateToken, validate(updateDeckSchema), controller.updateDeck);
deckRouter.delete("/:id", authenticateToken, validate(getDeckSchema), controller.deleteDeck);
deckRouter.delete("/delete/:id", authenticateToken, validate(getDeckSchema), controller.deleteDeck);

// Cards nested under a deck: /api/flashcard-decks/:deckId/cards
deckRouter.get("/:deckId/cards", optionalAuth, validate(listFlashcardsSchema), controller.listFlashcards);
deckRouter.get("/:deckId/cards/:id", optionalAuth, validate(getFlashcardSchema), controller.getFlashcard);
deckRouter.post("/:deckId/cards", authenticateToken, validate(createFlashcardSchema), controller.createFlashcard);
deckRouter.patch("/:deckId/cards/:id", authenticateToken, validate(updateFlashcardSchema), controller.updateFlashcard);
deckRouter.delete("/:deckId/cards/:id", authenticateToken, validate(getFlashcardSchema), controller.deleteFlashcard);

// ============== Tag Router (mounted at /api/tags) ==============
export const tagRouter: Router = Router();

tagRouter.get("/", validate({ query: z.object({ search: z.string().optional() }) }), controller.listTags);
// Admin-only tag management. Both REST-style and the legacy /create, /update
// paths are exposed so existing frontend callers keep working.
tagRouter.post("/", authenticateToken, requireAdmin, validate(createTagSchema), controller.createTag);
tagRouter.post("/create", authenticateToken, requireAdmin, validate(createTagSchema), controller.createTag);
tagRouter.put("/:id", authenticateToken, requireAdmin, validate(updateTagSchema), controller.updateTag);
tagRouter.put("/update/:id", authenticateToken, requireAdmin, validate(updateTagSchema), controller.updateTag);
tagRouter.post("/update/:id", authenticateToken, requireAdmin, validate(updateTagSchema), controller.updateTag);
tagRouter.delete("/:id", authenticateToken, requireAdmin, validate(tagIdParamSchema), controller.deleteTag);

// ============== Flashcards Router (mounted at /api/flashcards) ==============
// Alias for frontend: GET /api/flashcards/:deckId -> list cards in deck
export const flashcardsRouter: Router = Router();

flashcardsRouter.post("/create", authenticateToken, validate(createFlashcardFromBodySchema), controller.createFlashcardFromBody);
flashcardsRouter.put("/update/:id", authenticateToken, validate({ ...flashcardIdParamSchema, body: updateFlashcardSchema.body }), controller.updateFlashcardByCardId);
flashcardsRouter.delete("/delete/:id", authenticateToken, validate(flashcardIdParamSchema), controller.deleteFlashcardByCardId);
flashcardsRouter.get("/:deckId", optionalAuth, validate(listFlashcardsSchema), controller.listFlashcards);

// ============== Review Router (mounted at /api/flashcard-review) ==============
export const reviewRouter: Router = Router();

reviewRouter.get("/cards", authenticateToken, validate(getReviewCardsSchema), controller.getReviewCards);
reviewRouter.get("/queue/:deckId", authenticateToken, validate(getReviewQueueSchema), controller.getReviewQueue);
reviewRouter.post("/submit/:flashcardId", authenticateToken, validate(updateProgressSchema), controller.updateProgress);
reviewRouter.post("/:flashcardId", authenticateToken, validate(updateProgressSchema), controller.updateProgress);
reviewRouter.delete("/reset/:deckId", authenticateToken, validate(getReviewQueueSchema), controller.resetProgressByDeck);
