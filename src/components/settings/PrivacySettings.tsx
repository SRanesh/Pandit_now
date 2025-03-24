import React from 'react';
import { Shield, Eye } from 'lucide-react';

export function PrivacySettings() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-gray-500">Control who can see your profile</p>
            </div>
          </div>
          <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
            <option>Everyone</option>
            <option>Only when booked</option>
            <option>Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Show Contact Info</p>
              <p className="text-gray-500">Display your contact information to others</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
}