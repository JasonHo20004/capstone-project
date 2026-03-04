// =============================================================================
// Flashcard Routes - Express Router Configuration
// =============================================================================

import { Router } from "express";
import { FlashcardController } from "../controllers/flashcard.controller.js";
import { authenticateToken, optionalAuth, validate } from "@capstone/common";
import {
  createDeckSchema,
  updateDeckSchema,
  getDeckSchema,
  listDecksSchema,
  createFlashcardSchema,
  updateFlashcardSchema,
  getFlashcardSchema,
  listFlashcardsSchema,
  updateProgressSchema,
  getReviewCardsSchema,
} from "../dtos/flashcard.dto.js";

const controller = new FlashcardController();

// ============== Deck Router (mounted at /api/flashcard-decks) ==============
export const deckRouter: Router = Router();

deckRouter.get("/", optionalAuth, validate(listDecksSchema), controller.listDecks);
deckRouter.get("/:id", optionalAuth, validate(getDeckSchema), controller.getDeck);
deckRouter.post("/", authenticateToken, validate(createDeckSchema), controller.createDeck);
deckRouter.patch("/:id", authenticateToken, validate(updateDeckSchema), controller.updateDeck);
deckRouter.delete("/:id", authenticateToken, validate(getDeckSchema), controller.deleteDeck);

// Cards nested under a deck: GET/POST /api/flashcard-decks/:deckId/cards
deckRouter.get("/:deckId/cards", optionalAuth, validate(listFlashcardsSchema), controller.listFlashcards);
deckRouter.get("/:deckId/cards/:id", optionalAuth, validate(getFlashcardSchema), controller.getFlashcard);
deckRouter.post("/:deckId/cards", authenticateToken, validate(createFlashcardSchema), controller.createFlashcard);
deckRouter.patch("/:deckId/cards/:id", authenticateToken, validate(updateFlashcardSchema), controller.updateFlashcard);
deckRouter.delete("/:deckId/cards/:id", authenticateToken, validate(getFlashcardSchema), controller.deleteFlashcard);

// ============== Review Router (mounted at /api/flashcard-review) ==============
export const reviewRouter: Router = Router();

reviewRouter.get("/cards", authenticateToken, validate(getReviewCardsSchema), controller.getReviewCards);
reviewRouter.post("/:flashcardId", authenticateToken, validate(updateProgressSchema), controller.updateProgress);
