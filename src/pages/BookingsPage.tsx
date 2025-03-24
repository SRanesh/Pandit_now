import React from 'react';
import { BookingsList } from '../components/bookings/BookingsList';
import { BookingsHeader } from '../components/bookings/BookingsHeader';
import { useAuth } from '../hooks/useAuth';

export function BookingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BookingsHeader />
      <BookingsList userRole={user?.role} />
    </div>
  );
}