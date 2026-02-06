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

const router: Router = Router();
const controller = new FlashcardController();

// ============== Deck Routes ==============

// Public: List decks (with optional auth for personalized results)
router.get("/", optionalAuth, validate(listDecksSchema), controller.listDecks);

// Public: Get single deck (with optional auth for private deck access)
router.get("/:id", optionalAuth, validate(getDeckSchema), controller.getDeck);

// Protected: Create deck
router.post("/", authenticateToken, validate(createDeckSchema), controller.createDeck);

// Protected: Update deck
router.patch("/:id", authenticateToken, validate(updateDeckSchema), controller.updateDeck);

// Protected: Delete deck
router.delete("/:id", authenticateToken, validate(getDeckSchema), controller.deleteDeck);

// ============== Flashcard Routes (nested under decks) ==============

// Public: List flashcards in a deck
router.get("/:deckId/cards", optionalAuth, validate(listFlashcardsSchema), controller.listFlashcards);

// Public: Get single flashcard
router.get("/:deckId/cards/:id", optionalAuth, validate(getFlashcardSchema), controller.getFlashcard);

// Protected: Create flashcard
router.post("/:deckId/cards", authenticateToken, validate(createFlashcardSchema), controller.createFlashcard);

// Protected: Update flashcard
router.patch("/:deckId/cards/:id", authenticateToken, validate(updateFlashcardSchema), controller.updateFlashcard);

// Protected: Delete flashcard
router.delete("/:deckId/cards/:id", authenticateToken, validate(getFlashcardSchema), controller.deleteFlashcard);

// ============== Review/Progress Routes ==============

// Protected: Get cards due for review
router.get("/review/cards", authenticateToken, validate(getReviewCardsSchema), controller.getReviewCards);

// Protected: Update learning progress
router.post("/review/:flashcardId", authenticateToken, validate(updateProgressSchema), controller.updateProgress);

export default router;
