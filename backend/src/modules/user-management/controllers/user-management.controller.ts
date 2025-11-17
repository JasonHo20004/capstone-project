import type { Request, Response } from 'express';
import { UserManagementService } from '@/modules/user-management/services/user-management.service';

export class UserManagementController {
  private service = new UserManagementService();

  public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.service.getAllUsers();
      res.status(200).json({ success: true, message: 'Get all user profiles successfully', data: users, count: users.length });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get user profiles', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.service.createUser(req.body);
      res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create user', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.service.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'User updated successfully', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user', error: error instanceof Error ? error.message : String(error) });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.deleteUser(req.params.id);
      res.status(200).json({ success: true, message: 'User deleted successfully', data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user', error: error instanceof Error ? error.message : String(error) });
    }
  };

}