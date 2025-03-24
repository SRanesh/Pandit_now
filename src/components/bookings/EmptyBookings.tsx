import React from 'react';
import { Calendar } from 'lucide-react';

interface EmptyBookingsProps {
  userRole?: 'user' | 'pandit';
}

export function EmptyBookings({ userRole }: EmptyBookingsProps) {
  const message = userRole === 'pandit'
    ? "You haven't received any booking requests yet"
    : "You haven't made any bookings yet";

  const suggestion = userRole === 'pandit'
    ? "Complete your profile to increase visibility"
    : "Search for pandits to book ceremonies";

  return (
    <div className="text-center py-12">
      <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500">{suggestion}</p>
    </div>
  );
}