import type { Request, Response } from "express";
import { UserService } from "@/modules/users/services/user.service";
import type {
  UpdateUserInput,
  CreateCourseSellerApplicationInput,
  CreateUserInput,
} from "@/modules/users/dtos/user.dto";

import type { AuthenticatedRequest } from "@/middlewares/auth.middleware";
// import type { ReplOptions } from "repl";

export class UserController {
  private userService = new UserService();

  public getUserInformation = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const userData = await this.userService.getUserInformation(userId);
       res.status(200).json({
        success: true,
        message: "Get user Information successfully",
        data: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get user information",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public register = async (
    req: Request<{}, any, CreateUserInput["body"]>,
    res: Response
  ): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(200).json({
        success: true,
        message: "Register user successfully",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to register user",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public updateUser = async (
    req: AuthenticatedRequest & { body: UpdateUserInput["body"] },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const {fullName,phoneNumber, dateOfBirth,englishLevel, learningGoals} = req.body;
      const file = (req as any).file;
      const profilePicture = file?.location || file?.key;
      const updatedUser = await this.userService.updateUser(userId, {fullName,phoneNumber, dateOfBirth,englishLevel, learningGoals,profilePicture});

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
        // 404 Not Found
        return;
      }
      res.status(500).json({
        success: false,
        message: "Failed to update user profile",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public createCourseSellerAppolication = async (
    req: AuthenticatedRequest & {
      body: CreateCourseSellerApplicationInput["body"];
    },
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const updateData = req.body;

      const updatedUser = await this.userService.createCourseSellerApplication(
        userId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Create CourseSeller profile successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Failed to Create CourseSeller profile",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
