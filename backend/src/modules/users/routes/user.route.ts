import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../../../middlewares/validations.middleware';
import { createUserDTO } from '../dtos/user.dto';
const router = Router();
const userController = new UserController();

router.get('/',userController.getAllUsers);

router.post('/register',validate(createUserDTO),userController.register);
export default router;