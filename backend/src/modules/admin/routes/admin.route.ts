import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import revenueRoute from '../../revenue/routes/revenue.route';
import contractsManagementRoute from '../../contract-management/routes/contract-management.route';
import usersManagementRoute from '../../user-management/routes/user-management.route';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))

router.use('/users', usersManagementRoute);

router.post('/upgrade-to-course-seller/:applicationId/:status',validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);

router.use('/contracts', contractsManagementRoute);


router.use('/revenue', revenueRoute);

export default router;