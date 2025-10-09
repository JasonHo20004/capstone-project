import type { Request, Response } from 'express';
import { UserService } from '@/modules/users/services/user.service';
import type { UpdateUserInput } from '@/modules/users/dtos/user.dto';

export class UserController {
  private userService = new UserService();  

  public  getAllUsers= async(_req: Request, res: Response):Promise<void> =>{
    try {
      const userProfiles = await this.userService.getAllUsers();
      
      res.status(200).json({
        success: true,
        message: 'Get all user profiles successfully',
        data: userProfiles,
        count: userProfiles.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user profiles',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  public register= async(req: Request, res: Response):Promise<void> =>{
    try {

      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      
      res.status(200).json({
        success: true,
        message: 'Register user successfully',
        data: newUser,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  public updateUser = async (req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Gọi service để thực hiện logic cập nhật
      const updatedUser = await this.userService.updateUser(userId, updateData);

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ success: false, message: error.message }); 
        // 404 Not Found
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
};