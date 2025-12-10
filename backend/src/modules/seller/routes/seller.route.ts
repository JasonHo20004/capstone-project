import { Router } from 'express';
import { SellerController } from '../controllers/seller.controller';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const sellerController = new SellerController();

// All routes require authentication and COURSESELLER role
router.use(authMiddleware);
router.use(checkRole([UserRole.COURSESELLER]));

// Dashboard stats
router.get('/dashboard', sellerController.getDashboardStats);

// Learners
router.get('/learners', sellerController.getLearners);

// Comments
router.get('/comments', sellerController.getComments);

// Monthly fees
router.get('/fees', sellerController.getMonthlyFees);

export default router;

