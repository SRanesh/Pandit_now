import React from 'react';
import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Settings className="w-8 h-8 text-orange-500" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>
    </div>
  );
}