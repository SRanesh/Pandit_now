import type { User } from '../types/auth';

interface ProfileUpdateData {
  name: string;
  phone?: string;
  location?: string;
}

class ProfileService {
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the profile on the backend
    return {
      id: '1',
      name: data.name,
      email: 'user@example.com',
      role: 'user',
      profile: {
        phone: data.phone || '',
        location: data.location || '',
        experience: '',
        languages: [],
        specializations: []
      }
    };
  }
}

export const profileService = new ProfileService();