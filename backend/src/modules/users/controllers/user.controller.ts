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
        message: "Lấy thông tin người dùng thành công",
        data: userData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy thông tin người dùng thất bại",
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
        message: "Đăng ký người dùng thành công",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Đăng ký người dùng thất bại",
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
      const {
        fullName,
        phoneNumber,
        dateOfBirth,
        englishLevel,
        learningGoals,
      } = req.body;
      const file = (req as any).file;
      const profilePicture = file?.location || file?.key;
      const updatedUser = await this.userService.updateUser(userId, {
        fullName,
        phoneNumber,
        dateOfBirth,
        englishLevel,
        learningGoals,
        profilePicture,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công",
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
        message: "Cập nhật thông tin người dùng thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public createCourseSellerApplication = async (
  req: AuthenticatedRequest & {
    body: CreateCourseSellerApplicationInput["body"];
  },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { expertise } = req.body; // Giả sử expertise là string[] hoặc string

    // 1. Validate: Kiểm tra xem có file nào được upload không
    // Ép kiểu req.files về đúng dạng của Multer S3 để TypeScript không báo lỗi
    const files = req.files as Express.MulterS3.File[] | undefined;

    if (!files || files.length === 0) {
      // Return ngay lập tức nếu thiếu ảnh chứng chỉ (Validation)
      res.status(400).json({ 
        success: false, 
        message: "Chứng chỉ ảnh là bắt buộc." 
      });
      return; 
    }

    // 2. Transform Data: Chỉ lấy ra đường dẫn URL từ S3 để lưu vào DB
    // files là mảng object -> map ra mảng string (url)
  
    const certificationUrls = files.map((file) => file.location);
    
    // Chuẩn bị dữ liệu update
    const updateData = {
      certification: certificationUrls, // Mảng các đường link ảnh
      expertise: expertise,
    };

    // 3. Call Service
    const updatedUser = await this.userService.createCourseSellerApplication(
      userId,
      updateData
    );

    // 4. Response Success
    res.status(200).json({
      success: true,
      message: "Tạo hồ sơ bán khóa học thành công",
      data: updatedUser,
    });

  } catch (error) {
    // 5. Error Handling tập trung
    if (error instanceof Error) {
        // Xử lý các lỗi business logic cụ thể nếu cần
        if (error.message.includes("not found")) {
            res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
            return;
        }
    }

  
    res.status(500).json({
      success: false,
      message: "Tạo hồ sơ bán khóa học thất bại",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
}
