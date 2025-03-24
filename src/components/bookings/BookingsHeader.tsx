import React from 'react';
import { Calendar } from 'lucide-react';

export function BookingsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-8 h-8 text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
      </div>
      <p className="text-gray-600">Manage your ceremony bookings and appointments</p>
    </div>
  );
}