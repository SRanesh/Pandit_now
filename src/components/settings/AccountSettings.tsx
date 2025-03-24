import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function AccountSettings() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Full Name</p>
              <p className="text-gray-500">{user?.name}</p>
            </div>
          </div>
          <Button variant="secondary">Edit</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Email Address</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="secondary">Change</Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Phone Number</p>
              <p className="text-gray-500">{user?.profile?.phone || 'Not set'}</p>
            </div>
          </div>
          <Button variant="secondary">Add</Button>
        </div>
      </div>
    </div>
  );
}