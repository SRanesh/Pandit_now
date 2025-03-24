import React from 'react';
import { BookingCard } from './BookingCard';
import { EmptyBookings } from './EmptyBookings';
import { useBookings } from '../../hooks/useBookings';

interface BookingsListProps {
  userRole?: 'user' | 'pandit';
}

export function BookingsList({ userRole }: BookingsListProps) {
  const { bookings, cancelBooking, refreshBookings, isLoading } = useBookings();

  React.useEffect(() => {
    if (!isLoading) {
      refreshBookings();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-100 rounded-lg max-w-2xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyBookings userRole={userRole} />;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          onUpdate={refreshBookings}
          onCancel={cancelBooking}
        />
      ))}
    </div>
  );
}