import { PrismaClient, UserRole } from '../../generated/prisma';
import { databaseService } from '../services';
import type { IUserRepository } from './interfaces/IUserRepository';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
  UserProfileDto,
  UserQueryOptions,
  UserFilters,
  UserPaginationOptions,
  UserSearchOptions,
  UserValidationResult,
  PasswordValidationResult,
} from '../types';
import { validateCreateUserDto, validateUpdateUserDto } from '../utils/validation';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';

// =============================================================================
// User Repository Implementation
// =============================================================================

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = databaseService.getClient();
  }

  // =============================================================================
  // CRUD Operations
  // =============================================================================

  async create(userData: CreateUserDto): Promise<User> {
    try {
      // Validate input data
      const validation = validateCreateUserDto(userData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check if email already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: userData.email.trim().toLowerCase(),
          password: hashedPassword,
          fullName: userData.fullName.trim(),
          phoneNumber: userData.phoneNumber?.trim() || null,
          profilePicture: userData.profilePicture?.trim() || null,
          dateOfBirth: userData.dateOfBirth,
          englishLevel: userData.englishLevel?.trim() || null,
          learningGoals: userData.learningGoals || [],
          role: userData.role,
        },
      });

      return user as User;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('Failed to create user: Unknown error');
    }
  }

  async findById(id: string, options?: UserQueryOptions): Promise<User | null> {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const includeRelations = this.buildIncludeClause(options);

      const user = await this.prisma.user.findUnique({
        where: { id },
        include: includeRelations,
      });

      return user as User | null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async findByEmail(email: string, options?: UserQueryOptions): Promise<User | null> {
    try {
      if (!email || typeof email !== 'string') {
        return null;
      }

      const includeRelations = this.buildIncludeClause(options);

      const user = await this.prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: includeRelations,
      });

      return user as User | null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      // Validate input data
      const validation = validateUpdateUserDto(userData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check if user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Prepare update data
      const updateData: any = {};
      
      if (userData.fullName !== undefined) {
        updateData.fullName = userData.fullName.trim();
      }
      if (userData.phoneNumber !== undefined) {
        updateData.phoneNumber = userData.phoneNumber?.trim() || null;
      }
      if (userData.profilePicture !== undefined) {
        updateData.profilePicture = userData.profilePicture?.trim() || null;
      }
      if (userData.englishLevel !== undefined) {
        updateData.englishLevel = userData.englishLevel?.trim() || null;
      }
      if (userData.learningGoals !== undefined) {
        updateData.learningGoals = userData.learningGoals;
      }

      // Update user
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return updatedUser as User;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
      throw new Error('Failed to update user: Unknown error');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
      throw new Error('Failed to delete user: Unknown error');
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true },
      });
      return user !== null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const whereClause: any = {
        email: email.trim().toLowerCase(),
      };

      if (excludeUserId) {
        whereClause.id = { not: excludeUserId };
      }

      const user = await this.prisma.user.findFirst({
        where: whereClause,
        select: { id: true },
      });

      return user !== null;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  // =============================================================================
  // Query Operations
  // =============================================================================

  async findAll(
    filters?: UserFilters,
    pagination?: UserPaginationOptions,
    search?: UserSearchOptions,
    options?: UserQueryOptions
  ): Promise<User[]> {
    try {
      const includeRelations = this.buildIncludeClause(options);
      
      // Build where clause
      const whereClause = this.buildWhereClause(filters, search);
      
      // Build pagination
      const skip = pagination?.page && pagination?.limit 
        ? (pagination.page - 1) * pagination.limit 
        : undefined;
      
      const take = pagination?.limit || undefined;

      // Build order by
      const orderBy = this.buildOrderByClause(pagination);

      const queryOptions: any = {
        where: whereClause,
        include: includeRelations,
        skip,
        orderBy,
      };
      
      if (take !== undefined) {
        queryOptions.take = take;
      }

      const users = await this.prisma.user.findMany(queryOptions);

      return users as User[];
    } catch (error) {
      console.error('Error finding users:', error);
      return [];
    }
  }

  async findByRole(role: UserRole, options?: UserQueryOptions): Promise<User[]> {
    try {
      const includeRelations = this.buildIncludeClause(options);

      const users = await this.prisma.user.findMany({
        where: { role },
        include: includeRelations,
        orderBy: { createdAt: 'desc' },
      });

      return users as User[];
    } catch (error) {
      console.error('Error finding users by role:', error);
      return [];
    }
  }

  async count(filters?: UserFilters): Promise<number> {
    try {
      const whereClause = this.buildWhereClause(filters);

      return await this.prisma.user.count({
        where: whereClause,
      });
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  // =============================================================================
  // Password Operations
  // =============================================================================

  async updatePassword(id: string, passwordData: UpdateUserPasswordDto): Promise<void> {
    try {
      // Check if user exists
      const user = await this.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(passwordData.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`New password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(passwordData.newPassword);

      // Update password
      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update password: ${error.message}`);
      }
      throw new Error('Failed to update password: Unknown error');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return comparePassword(password, hash);
  }

  // =============================================================================
  // Business Logic Operations
  // =============================================================================


  // =============================================================================
  // Validation Operations
  // =============================================================================

  async validateUserData(userData: CreateUserDto | UpdateUserDto, isUpdate: boolean = false): Promise<UserValidationResult> {
    if (isUpdate) {
      return validateUpdateUserDto(userData as UpdateUserDto);
    } else {
      return validateCreateUserDto(userData as CreateUserDto);
    }
  }

  async validatePassword(password: string): Promise<PasswordValidationResult> {
    return validatePassword(password);
  }

  // =============================================================================
  // Utility Operations
  // =============================================================================

  toProfileDto(user: User): UserProfileDto {
    const result: UserProfileDto = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      learningGoals: user.learningGoals,
      role: user.role,
    };
    
    // Only add optional fields if they exist
    if (user.phoneNumber) {
      result.phoneNumber = user.phoneNumber;
    }
    if (user.profilePicture) {
      result.profilePicture = user.profilePicture;
    }
    if (user.englishLevel) {
      result.englishLevel = user.englishLevel;
    }
    
    return result;
  }

  async getProfile(id: string): Promise<UserProfileDto | null> {
    try {
      const user = await this.findById(id);
      if (!user) {
        return null;
      }
      return this.toProfileDto(user);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async softDelete(_id: string): Promise<void> {
    // Note: This would require adding an 'isActive' or 'deletedAt' field to the User model
    throw new Error('Soft delete not implemented - requires schema modification');
  }

  async restore(_id: string): Promise<User> {
    // Note: This would require adding an 'isActive' or 'deletedAt' field to the User model
    throw new Error('Restore not implemented - requires schema modification');
  }

  // =============================================================================
  // Private Helper Methods
  // =============================================================================

  private buildIncludeClause(options?: UserQueryOptions): any {
    const include: any = {};

    if (options?.includeWallet) {
      include.wallet = true;
    }

    if (options?.includeProfile) {
      include.courseSellerProfile = true;
      include.administratorProfile = true;
    }

    if (options?.includeRelations) {
      include.wallet = true;
      include.courseSellerProfile = true;
      include.administratorProfile = true;
      include.userNotifications = true;
      include.flashcardDecks = true;
      include.topupOrders = true;
      include.courses = true;
      include.practiceSessions = true;
      include.subscriptionContracts = true;
      include.ratings = true;
    }

    return Object.keys(include).length > 0 ? include : undefined;
  }

  private buildWhereClause(filters?: UserFilters, search?: UserSearchOptions): any {
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.englishLevel) {
      where.englishLevel = filters.englishLevel;
    }

    if (filters?.hasWallet !== undefined) {
      if (filters.hasWallet) {
        where.wallet = { isNot: null };
      } else {
        where.wallet = { is: null };
      }
    }

    if (filters?.createdAfter) {
      where.createdAt = { ...where.createdAt, gte: filters.createdAfter };
    }

    if (filters?.createdBefore) {
      where.createdAt = { ...where.createdAt, lte: filters.createdBefore };
    }

    // Search functionality
    if (search?.searchTerm && search.searchFields && search.searchFields.length > 0) {
      const searchConditions = search.searchFields.map(field => ({
        [field]: {
          contains: search.searchTerm,
          mode: 'insensitive' as const,
        },
      }));

      if (searchConditions.length > 0) {
        where.OR = searchConditions;
      }
    }

    return where;
  }

  private buildOrderByClause(pagination?: UserPaginationOptions): any {
    if (!pagination?.sortBy) {
      return { createdAt: 'desc' };
    }

    const orderBy: any = {};
    orderBy[pagination.sortBy] = pagination.sortOrder || 'desc';

    return orderBy;
  }
}
