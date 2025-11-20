import { Router } from 'express';
import { DashboardController } from '@/modules/admin/controllers/dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();

// Get dashboard stats only
router.get('/stats', dashboardController.getDashboardStats);

// Get complete dashboard data
router.get('/', dashboardController.getDashboardData);

// Get revenue data
router.get('/revenue', dashboardController.getRevenueData);

// Get user growth data
router.get('/user-growth', dashboardController.getUserGrowthData);

// Get course status data
router.get('/course-status', dashboardController.getCourseStatusData);

export default router;
