import { Router } from "express";
import { validate } from "@/middlewares/validations.middleware";
import { getReviewQueueDTO } from "@/modules/flashcards/dtos/flashcardReview.dto";
import { FlashcardReviewController } from "../controllers/flashcardReview.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();
const controller = new FlashcardReviewController();


router.get(
  "/queue/:deckId",
  authMiddleware,
  validate(getReviewQueueDTO),
  controller.getReviewQueue
);



export default router;