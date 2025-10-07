import bcrypt from 'bcrypt';
import type { PasswordValidationResult } from '../types/user.types';

// =============================================================================
// Password Utilities
// =============================================================================

const SALT_ROUNDS = 12;

/**
 * Password strength regex patterns
 */
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const MEDIUM_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash || typeof password !== 'string' || typeof hash !== 'string') {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns PasswordValidationResult - Password validation result
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return {
      isValid: false,
      errors,
      strength: 'weak',
    };
  }

  const trimmedPassword = password.trim();

  // Basic length check
  if (trimmedPassword.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (trimmedPassword.length > 128) {
    errors.push('Password must be no more than 128 characters long');
  }

  // Character requirements
  if (!/[a-z]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(trimmedPassword)) {
    errors.push('Password must contain at least one number');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (STRONG_PASSWORD_REGEX.test(trimmedPassword)) {
    strength = 'strong';
  } else if (MEDIUM_PASSWORD_REGEX.test(trimmedPassword)) {
    strength = 'medium';
  }

  // Additional checks for strong passwords
  if (strength === 'strong') {
    // Check for special characters
    if (!/[@$!%*?&]/.test(trimmedPassword)) {
      errors.push('Strong passwords should contain at least one special character (@$!%*?&)');
    }
  }

  // Common password checks
  const commonPasswords = [
    'password',
    '123456',
    'password123',
    'admin',
    'qwerty',
    'abc123',
    'password1',
    'welcome',
    'login',
    'master',
  ];

  if (commonPasswords.includes(trimmedPassword.toLowerCase())) {
    errors.push('Password is too common, please choose a more unique password');
  }

  // Sequential character check
  if (/(.)\1{2,}/.test(trimmedPassword)) {
    errors.push('Password should not contain repeated characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Generate a secure random password
 * @param length - Password length (default: 12)
 * @param includeSpecialChars - Include special characters (default: true)
 * @returns string - Generated password
 */
export function generatePassword(length: number = 12, includeSpecialChars: boolean = true): string {
  if (length < 6 || length > 128) {
    throw new Error('Password length must be between 6 and 128 characters');
  }

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = lowercase + uppercase + numbers;
  if (includeSpecialChars) {
    charset += specialChars;
  }

  let password = '';

  // Ensure at least one character from each required category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  if (includeSpecialChars) {
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  }

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Check if password meets minimum requirements
 * @param password - Password to check
 * @returns boolean - True if meets minimum requirements
 */
export function meetsMinimumRequirements(password: string): boolean {
  const result = validatePassword(password);
  return result.isValid && result.strength !== 'weak';
}
