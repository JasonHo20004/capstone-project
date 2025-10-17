import { Router } from 'express';
//import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createTagDTO } from '@/modules/flashcards/dtos/tag.dto';
import {TagController} from '../controllers/tag.controller'
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import  { UserRole } from  "@/../generated/prisma";
const router = Router();
const tagController = new TagController();

router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))
router.post('/create',validate(createTagDTO),tagController.createTag);

export default router;