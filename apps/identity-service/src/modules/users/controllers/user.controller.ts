// =============================================================================
// User Controller - HTTP handlers for user endpoints
// =============================================================================

import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { asyncHandler, NotFoundError } from "@capstone/common";

export class UserController {
  private userService = new UserService();

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getById(id as string);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  // Internal endpoint for other services to get basic user info
  getBasicInfo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getBasicInfo(id as string);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({ success: true, data: user });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.userService.update(userId, req.body);
    
    res.json({ success: true, data: user });
  });

  getMany = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as any;
    const result = await this.userService.getMany({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      search: query.search,
      role: query.role,
    });

    res.json({ success: true, ...result });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.userService.delete(id as string);
    
    res.json({ success: true, message: "User deleted successfully" });
  });
}
