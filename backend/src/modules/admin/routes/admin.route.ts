import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
const router = Router();
const adminController = new AdminController();

router.post('/upgrade-to-course-seller/:userId/:status',validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);


export default router;