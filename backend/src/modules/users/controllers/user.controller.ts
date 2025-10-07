import type { Request, Response } from 'express';
import { userService } from '../services/user.service.js';

export const userController = {
  async getAllUsers(_req: Request, res: Response):Promise<void> {
    try {
      const userProfiles = await userService.getAllUsers();
      
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
};