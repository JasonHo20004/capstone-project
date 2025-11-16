import { Router } from 'express';
import { ContractManagementController } from '@/modules/contract-management/controllers/contract.controller';
import { validate } from '@/middlewares/validations.middleware';
import {
  createContractDTO,
  renewContractDTO,
  updateContractStatusDTO,
  sendNotificationDTO,
  getContractHistoryDTO,
  lockSellerDTO
} from '@/modules/contract-management/dtos/contract.dto';

const router = Router();
const controller = new ContractManagementController();

router.get('/dashboard', controller.getDashboard);
router.post('/', validate(createContractDTO), controller.create);
router.put('/:contractId/renew', validate(renewContractDTO), controller.renew);
router.post('/send-notifications', validate(sendNotificationDTO), controller.sendNotifications);
router.put('/:contractId/status', validate(updateContractStatusDTO), controller.updateStatus);
router.get('/:sellerId/history', validate(getContractHistoryDTO), controller.history);
router.post('/:contractId/lock-seller', validate(lockSellerDTO), controller.lockSeller);
router.post('/handle-non-renewal', controller.handleNonRenewal);
router.post('/send-scheduled-notifications', controller.sendScheduledNotifications);

export default router;