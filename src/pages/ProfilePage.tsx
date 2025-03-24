import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { DevoteeProfile } from '../components/profile/DevoteeProfile';
import { PanditProfile } from '../components/profile/PanditProfile';
import { ProfileActions } from '../components/profile/ProfileActions';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();

  if (!user) return null;

  const handleUpdateBio = async (bio: string) => {
    await updateProfile({
      name: user.name,
      bio,
      phone: user.profile?.phone,
      location: user.profile?.location,
      avatarUrl: user.profile?.avatarUrl,
      experience: user.profile?.experience
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader user={user} />
      <div className="mt-8">
        {user.role === 'pandit' ? (
          <PanditProfile 
            profile={user.profile} 
            onUpdateBio={handleUpdateBio}
          />
        ) : (
          <DevoteeProfile user={user} />
        )}
      </div>
      <ProfileActions />
    </div>
  );
}