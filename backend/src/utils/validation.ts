import type {
  CreateUserDto,
  UpdateUserDto,
  UserValidationResult,
} from '../types/user.types';
import { UserRole } from '../../generated/prisma';

// =============================================================================
// Validation Utilities
// =============================================================================

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;


/**
 * Validate email format
 * @param email - Email to validate
 * @returns boolean - True if valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone number format
 * @param phoneNumber - Phone number to validate
 * @returns boolean - True if valid
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  return PHONE_REGEX.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validate user role
 * @param role - Role to validate
 * @returns boolean - True if valid
 */
export function validateUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Validate date of birth (must be in the past and reasonable age)
 * @param dateOfBirth - Date to validate
 * @returns boolean - True if valid
 */
export function validateDateOfBirth(dateOfBirth: Date): boolean {
  if (!dateOfBirth || !(dateOfBirth instanceof Date)) return false;
  
  const now = new Date();
  const age = now.getFullYear() - dateOfBirth.getFullYear();
  
  // Must be at least 13 years old and not more than 120 years old
  return age >= 13 && age <= 120;
}

/**
 * Validate full name
 * @param fullName - Name to validate
 * @returns boolean - True if valid
 */
export function validateFullName(fullName: string): boolean {
  if (!fullName || typeof fullName !== 'string') return false;
  
  const trimmed = fullName.trim();
  return trimmed.length >= 2 && trimmed.length <= 255;
}

/**
 * Validate learning goals
 * @param goals - Array of learning goals
 * @returns boolean - True if valid
 */
export function validateLearningGoals(goals: string[]): boolean {
  if (!Array.isArray(goals)) return false;
  
  return goals.every(goal => 
    typeof goal === 'string' && 
    goal.trim().length > 0 && 
    goal.trim().length <= 100
  );
}

/**
 * Validate English level
 * @param level - English level to validate
 * @returns boolean - True if valid
 */
export function validateEnglishLevel(level: string): boolean {
  if (!level || typeof level !== 'string') return false;
  
  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Beginner', 'Intermediate', 'Advanced'];
  return validLevels.includes(level.trim());
}

/**
 * Validate CreateUserDto
 * @param userData - User data to validate
 * @returns UserValidationResult - Validation result
 */
export function validateCreateUserDto(userData: CreateUserDto): UserValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (!userData.email || !validateEmail(userData.email)) {
    errors.push('Email không hợp lệ');
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }

  if (!userData.fullName || !validateFullName(userData.fullName)) {
    errors.push('Họ và tên phải có độ dài từ 2 đến 255 ký tự');
  }

  if (!userData.dateOfBirth || !validateDateOfBirth(userData.dateOfBirth)) {
    errors.push('Ngày sinh phải là một ngày trong quá khứ và có tuổi từ 13 đến 120 tuổi');
  }

  if (!userData.role || !validateUserRole(userData.role)) {
    errors.push('Vai trò người dùng không hợp lệ');
  }

  // Optional fields validation
  if (userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
    errors.push('Số điện thoại không hợp lệ');
  }

  if (userData.englishLevel && !validateEnglishLevel(userData.englishLevel)) {
    errors.push('Cấp độ tiếng Anh không hợp lệ');
  }

  if (userData.learningGoals && !validateLearningGoals(userData.learningGoals)) {
    errors.push('Mục tiêu học tập không hợp lệ');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate UpdateUserDto
 * @param userData - User data to validate
 * @returns UserValidationResult - Validation result
 */
export function validateUpdateUserDto(userData: UpdateUserDto): UserValidationResult {
  const errors: string[] = [];

  // Optional fields validation (only validate if provided)
  if (userData.fullName !== undefined && !validateFullName(userData.fullName)) {
    errors.push('Họ và tên phải có độ dài từ 2 đến 255 ký tự');
  }

  if (userData.phoneNumber !== undefined && userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
    errors.push('Số điện thoại không hợp lệ');
  }

  if (userData.englishLevel !== undefined && userData.englishLevel && !validateEnglishLevel(userData.englishLevel)) {
    errors.push('Cấp độ tiếng Anh không hợp lệ');
  }

  if (userData.learningGoals !== undefined && userData.learningGoals && !validateLearningGoals(userData.learningGoals)) {
    errors.push('Mục tiêu học tập không hợp lệ');
  }

  // Check if at least one field is being updated
  if (Object.keys(userData).length === 0) {
    errors.push('Cần có ít nhất một trường được cập nhật');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
