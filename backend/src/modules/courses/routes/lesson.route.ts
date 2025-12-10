import { Router } from 'express';
import { LessonController } from '@/modules/courses/controllers/lesson.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createLessonDTO,
  updateLessonDTO,
  getLessonByIdDTO,
} from '@/modules/courses/dtos/lesson.dto';
import { UserRole } from '@prisma/client';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import { uploadVideoOptional, handleUploadError } from '@/middlewares/upload';

const router = Router();
const lessonController = new LessonController();

router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Lesson routes
router.post('/:courseId/lessons', uploadVideoOptional, handleUploadError, validate(createLessonDTO), lessonController.createLesson);

router.get('/:courseId/lessons',lessonController.getLessonsByCourse);

router.get('/:courseId/lessons/:lessonId',validate(getLessonByIdDTO),lessonController.getLessonById);

router.put('/:courseId/lessons/:lessonId',validate(updateLessonDTO),lessonController.updateLesson);

export default router;

