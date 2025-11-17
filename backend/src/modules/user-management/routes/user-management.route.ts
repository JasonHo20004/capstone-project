import { Router } from 'express';
import { UserManagementController } from '@/modules/user-management/controllers/user-management.controller';
import { authMiddleware, checkRole } from '@/middlewares/auth.middleware';
import { UserRole } from '@/../generated/prisma';

const router = Router();
const controller = new UserManagementController();

router.use(authMiddleware);
router.use(checkRole([UserRole.ADMINISTRATOR]));

router.get('/', controller.getAllUsers);

router.post('/create', controller.createUser);

router.put('/update/:id', controller.updateUser);

router.delete('/delete/:id', controller.deleteUser);

export default router;