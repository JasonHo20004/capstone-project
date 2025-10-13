import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))

router.get('/users',adminController.getAllUsers);

router.post('/upgrade-to-course-seller/:userId/:status',validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);


export default router;