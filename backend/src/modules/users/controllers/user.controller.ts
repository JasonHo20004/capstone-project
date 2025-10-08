import type { Request, Response } from 'express';
import { UserService } from '@/modules/users/services/user.service';

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
};