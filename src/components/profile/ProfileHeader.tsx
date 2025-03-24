import React from 'react';
import { User as UserType } from '../../types/auth';
import { UserAvatar } from '../UserAvatar';

interface ProfileHeaderProps {
  user: UserType;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar user={user} size="lg" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
          {user.role === 'pandit' ? 'Pandit' : 'Devotee'}
        </span>
      </div>
    </div>
  );
}