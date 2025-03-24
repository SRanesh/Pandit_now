import { StorageError } from '../utils/errorHandling';

class MockStorageService {
  async uploadProfileImage(file: File, userId: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a temporary URL for the uploaded file
    const tempUrl = URL.createObjectURL(file);
    
    return tempUrl;
  }

  async deleteProfileImage(filePath: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would delete the file
    console.log('Deleting file:', filePath);
  }
}

export const mockStorageService = new MockStorageService();