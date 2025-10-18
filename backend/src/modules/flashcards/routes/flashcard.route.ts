import { Router } from 'express';
//import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createFlashcardDTO} from '@/modules/flashcards/dtos/flashcard.dto';
import {FlashcardController} from '../controllers/flashcard.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const flashcardController = new FlashcardController();

router.post('/create',authMiddleware,validate(createFlashcardDTO),flashcardController.createFlashcard);


export default router;