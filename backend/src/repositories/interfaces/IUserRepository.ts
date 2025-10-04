import { UserRole } from '../../../generated/prisma';
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
} from '../../types';

// =============================================================================
// User Repository Interface
// =============================================================================

export interface IUserRepository {
  // =============================================================================
  // CRUD Operations
  // =============================================================================

  create(userData: CreateUserDto): Promise<User>;
  findById(id: string, options?: UserQueryOptions): Promise<User | null>;
  findByEmail(email: string, options?: UserQueryOptions): Promise<User | null>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  emailExists(email: string, excludeUserId?: string): Promise<boolean>;

  // =============================================================================
  // Query Operations
  // =============================================================================

  findAll(
    filters?: UserFilters,
    pagination?: UserPaginationOptions,
    search?: UserSearchOptions,
    options?: UserQueryOptions
  ): Promise<User[]>;
  findByRole(role: UserRole, options?: UserQueryOptions): Promise<User[]>;
  count(filters?: UserFilters): Promise<number>;

  // =============================================================================
  // Password Operations
  // =============================================================================

  updatePassword(id: string, passwordData: UpdateUserPasswordDto): Promise<void>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;

  // =============================================================================
  // Business Logic Operations
  // =============================================================================


  // =============================================================================
  // Validation Operations
  // =============================================================================

  validateUserData(userData: CreateUserDto | UpdateUserDto, isUpdate?: boolean): Promise<UserValidationResult>;
  validatePassword(password: string): Promise<PasswordValidationResult>;
  toProfileDto(user: User): UserProfileDto;
  getProfile(id: string): Promise<UserProfileDto | null>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<User>;
}
