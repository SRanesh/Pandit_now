import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUpload } from './ImageUpload';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types/auth';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const { updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    avatarUrl: user.profile?.avatarUrl || '',
    experience: user.profile?.experience || '0'
  });

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...formData,
        bio: user.profile?.bio || '' // Preserve existing bio
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        ...formData,
        bio: user.profile?.bio || '' // Preserve existing bio
      });
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ImageUpload 
            onUpload={handleImageUpload}
            currentImageUrl={formData.avatarUrl}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State"
            />
          </div>

          {user.role === 'pandit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <Input
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Enter years of experience"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleApply}
              isLoading={isLoading}
            >
              Apply
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Save & Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}