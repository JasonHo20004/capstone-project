import { Router } from 'express';
import { TestController } from '@/modules/tests/controllers/test.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createTestDTO,
  addQuestionDTO,
  getTestByIdDTO,
} from '@/modules/tests/dtos/test.dto';
import { UserRole } from '@/../generated/prisma';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const testController = new TestController();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Test routes
// POST /courses/:courseId/tests - Create a new test
router.post(
  '/courses/:courseId/tests',
  validate(createTestDTO),
  testController.createTest
);

// POST /tests/:testId/questions - Add a question to a test
router.post(
  '/tests/:testId/questions',
  validate(addQuestionDTO),
  testController.addQuestion
);

// GET /tests/:testId - Get test by ID
router.get(
  '/tests/:testId',
  validate(getTestByIdDTO),
  testController.getTestById
);

// GET /courses/:courseId/tests - Get tests for a course
router.get(
  '/courses/:courseId/tests',
  testController.getTestsByCourse
);

export default router;

