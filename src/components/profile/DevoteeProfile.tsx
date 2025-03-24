import React from 'react';
import { User } from '../../types/auth';
import { Calendar, MapPin } from 'lucide-react';

interface DevoteeProfileProps {
  user: User;
}

export function DevoteeProfile({ user }: DevoteeProfileProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Member Since</h3>
            <p className="text-gray-500">January 2024</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Location</h3>
            <p className="text-gray-500">{user.profile?.location || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-2">Recent Bookings</h3>
        <p className="text-gray-500">No bookings yet</p>
      </div>
    </div>
  );
}