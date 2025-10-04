import { UserRole } from '../../generated/prisma';

// =============================================================================
// User Entity Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth: Date;
  createdAt: Date;
  englishLevel?: string;
  learningGoals: string[];
  role: UserRole;
}

export interface UserWithRelations extends User {
  courseSellerProfile?: any;
  administratorProfile?: any;
  wallet?: any;
  userNotifications?: any[];
  flashcardDecks?: any[];
  topupOrders?: any[];
  courses?: any[];
  practiceSessions?: any[];
  subscriptionContracts?: any[];
  ratings?: any[];
  userLessons?: any[];
  userAnswers?: any[];
  userActivities?: any[];
  comments?: any[];
}

// =============================================================================
// DTOs (Data Transfer Objects)
// =============================================================================

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth: Date;
  englishLevel?: string;
  learningGoals?: string[];
  role: UserRole;
}

export interface UpdateUserDto {
  fullName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  englishLevel?: string;
  learningGoals?: string[];
}

export interface UpdateUserPasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth: Date;
  createdAt: Date;
  englishLevel?: string;
  learningGoals: string[];
  role: UserRole;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

// =============================================================================
// Query Types
// =============================================================================

export interface UserQueryOptions {
  includeRelations?: boolean;
  includeWallet?: boolean;
  includeProfile?: boolean;
}

export interface UserFilters {
  role?: UserRole;
  englishLevel?: string;
  hasWallet?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchOptions {
  searchTerm?: string;
  searchFields?: (keyof User)[];
}

// =============================================================================
// Response Types
// =============================================================================

export interface UserResponse {
  success: boolean;
  data?: User | UserProfileDto;
  message?: string;
  error?: string;
}

export interface UsersResponse {
  success: boolean;
  data?: {
    users: User[] | UserProfileDto[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
  error?: string;
}

// =============================================================================
// Validation Types
// =============================================================================

export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

// =============================================================================
// Business Logic Types
// =============================================================================
