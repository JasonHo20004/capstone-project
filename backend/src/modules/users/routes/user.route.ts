import { Router } from 'express';
import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createUserDTO, updateUserDTO,createCourseSellerApplicationDTO } from '@/modules/users/dtos/user.dto';
const router = Router();
const userController = new UserController();

router.get('/',userController.getAllUsers);

router.post('/register',validate(createUserDTO),userController.register);

router.put('/me/update/:userId',validate(updateUserDTO),userController.updateUser);

router.post('/me/course-seller-application/:userId', validate(createCourseSellerApplicationDTO),userController.createCourseSellerAppolication);
export default router;