import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.get('/users',authMiddleware,checkRole([UserRole.ADMINISTRATOR]),adminController.getAllUsers);

router.post('/upgrade-to-course-seller/:userId/:status',authMiddleware,checkRole([UserRole.ADMINISTRATOR]),validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);


export default router;