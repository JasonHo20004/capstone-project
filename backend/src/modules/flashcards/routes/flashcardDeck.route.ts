import { Router } from 'express';
//import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createFlashcardDeckDTO } from '@/modules/flashcards/dtos/flashcardDeck.dto';
import {FlashcardDeckController} from '../controllers/flashcardDeck.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const flashcardDeckController = new FlashcardDeckController();

router.post('/create',authMiddleware,validate(createFlashcardDeckDTO),flashcardDeckController.createFlashcardDeck);

router.put('/update',authMiddleware,validate(createFlashcardDeckDTO),flashcardDeckController.updateFlashcardDeck)

export default router;