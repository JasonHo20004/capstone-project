import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { startSessionDTO, answerQuestionDTO, submitDTO} from '@/modules/practice_sessions/dtos/practiceSession.dto';
import {PracticeSessionController} from '@/modules/practice_sessions/controllers/practiceSession.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';


const router = Router();
const practiceSessionController = new PracticeSessionController();

router.post('/start',authMiddleware,validate(startSessionDTO),practiceSessionController.startSession);


router.post('/:sessionId/answers',authMiddleware,validate(answerQuestionDTO),practiceSessionController.answerQuestion);

router.post('/:sessionId/submit',authMiddleware,validate(submitDTO),practiceSessionController.submit)
export default router;