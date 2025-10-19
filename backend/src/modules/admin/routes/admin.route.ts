import { Router } from 'express';
import { AdminController } from '@/modules/admin/controllers/admin.controller';
import { validate } from '@/middlewares/validations.middleware';
import { approveCourseSellerApplicationDTO } from '@/modules/admin/dtos/courseSeller.dto';
import {
  createContractDTO,
  renewContractDTO,
  updateContractStatusDTO,
  sendNotificationDTO,
  getContractHistoryDTO,
  lockSellerDTO
} from '@/modules/admin/dtos/contract.dto';
import { UserRole }  from "@/../generated/prisma";
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import { getRevenueOverviewDTO, getRevenueByTransactionTypeDTO, getRevenueByPeriodDTO } from '@/modules/admin/dtos/revenue.dto';

const router = Router();
const adminController = new AdminController();

router.post('/upgrade-to-course-seller/:userId/:status', validate(approveCourseSellerApplicationDTO), adminController.upgradeToCourseSeller);
router.use(authMiddleware)
router.use(checkRole([UserRole.ADMINISTRATOR]))

router.get('/users',adminController.getAllUsers);

router.post('/upgrade-to-course-seller/:userId/:status',validate(approveCourseSellerApplicationDTO),adminController.upgradeToCourseSeller);

// Contract Management
router.get('/contracts/dashboard', adminController.getContractDashboard);
router.post('/contracts', validate(createContractDTO), adminController.createContract);
router.put('/contracts/:contractId/renew', validate(renewContractDTO), adminController.renewContract);
router.post('/contracts/send-notifications', validate(sendNotificationDTO), adminController.sendNotifications);
router.put('/contracts/:contractId/status', validate(updateContractStatusDTO), adminController.updateContractStatus);
router.get('/contracts/:sellerId/history', validate(getContractHistoryDTO), adminController.getContractHistory);
router.post('/contracts/:contractId/lock-seller', validate(lockSellerDTO), adminController.lockSeller);
router.post('/contracts/handle-non-renewal', adminController.handleNonRenewal);
router.post('/contracts/send-scheduled-notifications', adminController.sendScheduledNotifications);


router.get('/revenue/overview', validate(getRevenueOverviewDTO), adminController.getRevenueOverview);   
router.get('/revenue/by-transaction-type', validate(getRevenueByTransactionTypeDTO), adminController.getRevenueByTransactionType);
router.get('/revenue/by-period', validate(getRevenueByPeriodDTO), adminController.getRevenueByPeriod);

export default router;