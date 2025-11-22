import { Router } from 'express';
import { UserController } from '@/modules/users/controllers/user.controller';
import { validate } from '@/middlewares/validations.middleware';
import { createUserDTO, updateUserDTO,createCourseSellerApplicationDTO } from '@/modules/users/dtos/user.dto';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { uploadVideo, handleUploadError } from '@/middlewares/upload';

const router = Router();
const userController = new UserController();



router.post('/register',validate(createUserDTO),userController.register);

router.get('/me',authMiddleware,userController.getUserInformation);

router.put('/me/update',uploadVideo,handleUploadError,authMiddleware,validate(updateUserDTO),userController.updateUser);

router.post('/me/course-seller-application',authMiddleware ,validate(createCourseSellerApplicationDTO),userController.createCourseSellerAppolication);
export default router;