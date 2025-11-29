import { Router } from 'express';
import { RatingController } from '@/modules/courses/controllers/rating.controller';
import { validate } from '@/middlewares/validations.middleware';
import { replyToRatingDTO, reportRatingDTO } from '@/modules/courses/dtos/rating.dto';
import { UserRole } from '@/../generated/prisma';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const ratingController = new RatingController();

router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER, UserRole.ADMINISTRATOR]));

// Rating management routes
router.post('/:ratingId/reply', validate(replyToRatingDTO), ratingController.replyToRating);
router.post('/:ratingId/report', validate(reportRatingDTO), ratingController.reportRating);

export default router;

