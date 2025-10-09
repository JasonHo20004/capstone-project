import { Router } from 'express';
import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createUserDTO, updateUserDTO } from '@/modules/users/dtos/user.dto';
const router = Router();
const userController = new UserController();

router.get('/',userController.getAllUsers);

router.post('/register',validate(createUserDTO),userController.register);

router.put('/update/:userId',validate(updateUserDTO),userController.updateUser);

export default router;