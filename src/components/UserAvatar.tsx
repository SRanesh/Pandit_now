import React from 'react';
import { User as UserIcon } from 'lucide-react';
import type { User } from '../types/auth';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // Show default icon if avatarUrl is empty string or undefined
  if (!user.profile?.avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} bg-orange-100 rounded-full flex items-center justify-center`}>
        <UserIcon className={`${iconSizes[size]} text-orange-600`} />
      </div>
    );
  }

  return (
    <img
      src={user.profile.avatarUrl}
      alt={user.name}
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  );
}