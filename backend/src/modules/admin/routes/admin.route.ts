import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import revenueRoute from '../../revenue-management-by-admin/routes/revenue.route';
import contractsManagementRoute from '../../contract-management/routes/contract-management.route';
import usersManagementRoute from '../../user-management-by-admin/routes/user-management.route';
import coursesManagementRoute from '../../course-management-by-admin/routes/course-management.route';
import transactionManagementRoute from '../../transaction-management-by-admin/routes/transaction-management.route';
import applicationsManagementRoute from '../../application-management-by-admin/routes/application-management.route';

import dashboardRoute from './dashboard.route';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))

router.use('/dashboard', dashboardRoute);

router.use('/users', usersManagementRoute);

router.post('/upgrade-to-course-seller/:applicationId/:status',validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);

router.use('/contracts', contractsManagementRoute);

router.use('/revenue', revenueRoute);

router.use('/courses', coursesManagementRoute);

router.use('/transactions', transactionManagementRoute);

router.use('/applications', applicationsManagementRoute);

export default router;