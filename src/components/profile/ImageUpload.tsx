import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { mockStorageService } from '../../services/mockStorageService';
import { useAuth } from '../../hooks/useAuth';
import { handleStorageError } from '../../utils/errorHandling';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUpload({ onUpload, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    try {
      if (!event.target.files?.length || !user?.id) {
        return;
      }

      setIsUploading(true);
      const file = event.target.files[0];
      const publicUrl = await mockStorageService.uploadProfileImage(file, user.id);
      onUpload(publicUrl);
    } catch (err) {
      const errorMessage = handleStorageError(err);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onUpload('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            type="button"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="relative overflow-hidden"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : currentImageUrl ? 'Change Image' : 'Upload Image'}
        </Button>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}