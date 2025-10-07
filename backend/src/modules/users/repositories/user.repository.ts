// src/modules/users/user.repository.ts

import { databaseService } from '../../../services/database.service.js';

export const userRepository = {
  /**
   * Lấy danh sách tất cả người dùng từ cơ sở dữ liệu.
   * Chỉ chọn các trường an toàn để trả về.
   */
  async findAll() {
    const prisma = databaseService.getClient();
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        profilePicture: true,
        dateOfBirth: true,
        englishLevel: true,
        learningGoals: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc' // Sắp xếp theo người dùng mới nhất
      }
    });
  }
};