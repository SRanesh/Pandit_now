import { supabase } from '../lib/supabase';
import { StorageError } from '../utils/errorHandling';
import { validateImageFile } from '../utils/fileValidation';

class StorageService {
  private readonly BUCKET_NAME = 'profile-images';

  async uploadProfileImage(file: File, userId: string): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new StorageError(validation.error || 'Invalid file');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new StorageError(
          'Failed to upload image',
          uploadError.message
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to upload image');
    }
  }

  async deleteProfileImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new StorageError('Failed to delete image', error.message);
      }
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to delete image');
    }
  }
}

export const storageService = new StorageService();