import React from 'react';
import { User, Users } from 'lucide-react';

interface SignUpOptionProps {
  onSelect: (type: 'user' | 'pandit') => void;
}

export function SignUpOptions({ onSelect }: SignUpOptionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center text-gray-900 mb-6">
        Choose how you want to join
      </h3>
      
      <button
        onClick={() => onSelect('user')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-4 group"
      >
        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
          <User className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-gray-900">Sign up as a Devotee</h4>
          <p className="text-sm text-gray-500">Book services and connect with pandits</p>
        </div>
      </button>

      <button
        onClick={() => onSelect('pandit')}
        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-4 group"
      >
        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
          <Users className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-gray-900">Sign up as a Pandit</h4>
          <p className="text-sm text-gray-500">Offer your services and grow your practice</p>
        </div>
      </button>
    </div>
  );
}