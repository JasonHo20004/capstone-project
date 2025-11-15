import { Router } from 'express';
import { TestController } from '@/modules/tests/controllers/test.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createTestDTO,
  getTestByIdDTO,
  createSectionDTO,
  getSectionsByTestIdDTO,
  getSectionByIdDTO,
  addPassageToSectionDTO,
  getPassagesBySectionIdDTO,
  addQuestionToSectionDTO,
  getQuestionsBySectionIdDTO,
  getQuestionByIdDTO,
} from '@/modules/tests/dtos/test.dto';
import { UserRole } from '@/../generated/prisma';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const testController = new TestController();

router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Test routes
router.post('/courses/:courseId/tests', validate(createTestDTO), testController.createTest);
router.get('/tests/:testId', validate(getTestByIdDTO), testController.getTestById);
router.get('/courses/:courseId/tests', testController.getTestsByCourse);

// Section routes
router.post('/tests/:testId/sections', validate(createSectionDTO), testController.createSection);
router.get('/tests/:testId/sections', validate(getSectionsByTestIdDTO), testController.getSectionsByTestId);
router.get('/sections/:sectionId', validate(getSectionByIdDTO), testController.getSectionById);

// Passage routes
router.post('/sections/:sectionId/passages', validate(addPassageToSectionDTO), testController.addPassageToSection);
router.get('/sections/:sectionId/passages', validate(getPassagesBySectionIdDTO), testController.getPassagesBySectionId);

// Question routes
router.post('/sections/:sectionId/questions', validate(addQuestionToSectionDTO), testController.addQuestionToSection);
router.get('/sections/:sectionId/questions', validate(getQuestionsBySectionIdDTO), testController.getQuestionsBySectionId);
router.get('/questions/:questionId', validate(getQuestionByIdDTO), testController.getQuestionById);

export default router;

