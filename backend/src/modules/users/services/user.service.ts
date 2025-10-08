import { userRepository } from '../repositories/user.repository';

export const userService = {
  async getAllUsers() {
    try {
      const users = await userRepository.findAll();
    
      
      return users;
    } catch (error) {
      console.error('Error in userService.getAllUsers:', error);
      throw new Error('Failed to retrieve users');
    }
  }
};