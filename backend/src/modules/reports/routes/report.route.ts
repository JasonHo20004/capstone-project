import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { createReportCourseDTO} from '@/modules/reports/dtos/report.dto';
import {ReportController} from '@/modules/reports/controllers/report.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
const router = Router();
const reportController = new ReportController();

router.post('/courses/:courseId',authMiddleware,validate(createReportCourseDTO),reportController.reportCourse);

export default router;