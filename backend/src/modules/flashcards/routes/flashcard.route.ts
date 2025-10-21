import { Router } from 'express';
//import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createFlashcardDTO,updateFlashcardDTO,deleteFlashcardDTO} from '@/modules/flashcards/dtos/flashcard.dto';
import {FlashcardController} from '../controllers/flashcard.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const flashcardController = new FlashcardController();

router.post('/create',authMiddleware,validate(createFlashcardDTO),flashcardController.createFlashcard);

router.put('/update/:flashcardId',authMiddleware,validate(updateFlashcardDTO),flashcardController.updateFlashcard)

router.delete('/delete/:flashcardId',authMiddleware, validate(deleteFlashcardDTO),flashcardController.deleteFlashcard)
export default router;