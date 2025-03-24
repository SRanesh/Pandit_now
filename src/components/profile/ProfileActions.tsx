import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Edit2 } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { useAuth } from '../../hooks/useAuth';

export function ProfileActions() {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="mt-8">
        <Button 
          variant="secondary" 
          className="flex items-center space-x-2"
          onClick={() => setShowEditModal(true)}
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Profile</span>
        </Button>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}