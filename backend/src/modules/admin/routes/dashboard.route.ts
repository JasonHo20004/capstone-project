import { Router } from 'express';
import { DashboardController } from '@/modules/admin/controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();



router.get('/', dashboardController.getDashboardData);

// router.get('/stats', dashboardController.getDashboardStats);

// router.get('/revenue', dashboardController.getRevenueData);

// router.get('/user-growth', dashboardController.getUserGrowthData);

// router.get('/course-status', dashboardController.getCourseStatusData);

export default router;
