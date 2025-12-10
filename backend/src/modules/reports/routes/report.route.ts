import { Router } from 'express';
import { validate } from '@/middlewares/validations.middleware';
import { createReportCourseDTO, getDetailReportDTO} from '@/modules/reports/dtos/report.dto';
import {ReportController} from '@/modules/reports/controllers/report.controller'
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import { UserRole }  from "@prisma/client";

const router = Router();
const reportController = new ReportController();

router.post('/courses/:courseId',authMiddleware,validate(createReportCourseDTO),reportController.reportCourse);

router.get('/',authMiddleware,checkRole([UserRole.ADMINISTRATOR]),reportController.getAllReports)

router.get('/detail/:reportId',authMiddleware,validate(getDetailReportDTO), reportController.getDetailReport)
export default router;