import { Router } from 'express';
import { CourseController } from '@/modules/courses/controllers/course.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createCourseDTO,
  updateCourseDTO,
  publishCourseDTO,
  getCourseByIdDTO,
  getCoursesBySellerDTO,
} from '@/modules/courses/dtos/course.dto';
import { UserRole } from '@/../generated/prisma';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const courseController = new CourseController();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Course routes
router.post('/', validate(createCourseDTO), courseController.createCourse);
router.get('/:courseId', validate(getCourseByIdDTO), courseController.getCourseById);
router.put('/:courseId', validate(updateCourseDTO), courseController.updateCourse);
router.put('/:courseId/publish', validate(publishCourseDTO), courseController.publishCourse);
router.get('/seller/:sellerId', validate(getCoursesBySellerDTO), courseController.getCoursesBySeller);

export default router;

