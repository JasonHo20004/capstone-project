import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { startSessionDTO} from '@/modules/practice_sessions/dtos/practiceSession.dto';
import {PracticeSessionController} from '@/modules/practice_sessions/controllers/practiceSession.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';


const router = Router();
const practiceSessionController = new PracticeSessionController();

router.post('/start',authMiddleware,validate(startSessionDTO),practiceSessionController.startSession);

export default router;