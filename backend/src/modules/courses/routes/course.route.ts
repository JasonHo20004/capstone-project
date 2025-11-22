import { Router } from 'express';
import { CourseController } from '@/modules/courses/controllers/course.controller';
import { AnalyticsController } from '@/modules/courses/controllers/analytics.controller';
import { NotificationController } from '@/modules/notifications/controllers/notification.controller';
import { RatingController } from '@/modules/courses/controllers/rating.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createCourseDTO,
  updateCourseDTO,
  publishCourseDTO,
  getCourseByIdDTO,
  getCoursesBySellerDTO,
  getCoursesDTO,
} from '@/modules/courses/dtos/course.dto';
import { getCompletionAnalyticsDTO } from '@/modules/courses/dtos/analytics.dto';
import { sendCourseUpdateNotificationDTO } from '@/modules/notifications/dtos/notification.dto';
import { getCourseRatingsDTO } from '@/modules/courses/dtos/rating.dto';
import { UserRole } from '@/../generated/prisma';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const courseController = new CourseController();
const analyticsController = new AnalyticsController();
const notificationController = new NotificationController();
const ratingController = new RatingController();

// Public route - Get all courses with pagination and filters
router.get('/', validate(getCoursesDTO), courseController.getCourses);

// Protected routes - require authentication and role
router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Course routes
router.post('/', validate(createCourseDTO), courseController.createCourse);
router.get('/seller/me', courseController.getMyCourses);
router.get('/seller/:sellerId', validate(getCoursesBySellerDTO), courseController.getCoursesBySeller);
router.get('/:courseId/analytics/completion', validate(getCompletionAnalyticsDTO), analyticsController.getCompletionRate);
router.post('/:courseId/notifications', validate(sendCourseUpdateNotificationDTO), notificationController.sendCourseUpdateNotification);
router.get('/:courseId/ratings', validate(getCourseRatingsDTO), ratingController.getCourseRatings);
router.get('/:courseId', validate(getCourseByIdDTO), courseController.getCourseById);
router.put('/:courseId', validate(updateCourseDTO), courseController.updateCourse);
router.put('/:courseId/publish', validate(publishCourseDTO), courseController.publishCourse);

export default router;

