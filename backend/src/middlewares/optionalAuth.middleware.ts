import type { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@/../generated/prisma"; // Import đúng từ prisma của bạn
import type { AuthenticatedRequest } from "./auth.middleware"; 

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Không có token -> Khách -> Cho qua
    return next();
  }

  // 👇 QUAN TRỌNG: Phải dùng đúng tên biến môi trường chứa Secret Key
  const secretKey = process.env.ACCESS_TOKEN_SECRET; 

  if (!secretKey) {
    console.error("❌ ACCESS_TOKEN_SECRET is not defined");
    return next();
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // Token lỗi/hết hạn -> Coi như khách -> Cho qua
      // (Bạn có thể console.log(err) ở đây để debug xem lỗi gì)
      console.log("⚠️ Optional Auth Token Error:", err.message);
      return next();
    } else {
      // ✅ Token đúng -> Gán user
      req.user = decoded as { userId: string; role: UserRole };
      console.log("✅ Optional Auth Success UserID:", req.user.userId); // Log để kiểm tra
      console.log("HIiiiiiiiiiiiiii")
      return next();
    }
  });
};