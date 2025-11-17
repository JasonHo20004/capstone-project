import { Router } from 'express';
//import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createFlashcardDeckDTO, updateFlashcardDeckDTO, deleteFlashcardDeckDTO } from '@/modules/flashcards/dtos/flashcardDeck.dto';
import {FlashcardDeckController} from '../controllers/flashcardDeck.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const flashcardDeckController = new FlashcardDeckController();

router.post('/',authMiddleware,flashcardDeckController.getAllFlashcardDeck)
router.post('/create',authMiddleware,validate(createFlashcardDeckDTO),flashcardDeckController.createFlashcardDeck);

router.put('/update/:flashcardDeckId',authMiddleware,validate(updateFlashcardDeckDTO),flashcardDeckController.updateFlashcardDeck)

router.delete('/delete/:flashcardDeckId', authMiddleware,validate(deleteFlashcardDeckDTO),flashcardDeckController.deleteFlashcardDeck)
export default router;