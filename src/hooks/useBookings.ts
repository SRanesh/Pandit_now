import { useState, useEffect } from 'react';
import { firebaseBookingService } from '../services/firebaseBookingService';
import { useAuth } from './useAuth';
import type { Booking } from '../types/booking';

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await firebaseBookingService.getBookings(user.id, user.role);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Unable to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const success = await firebaseBookingService.cancelBooking(bookingId);
      if (success) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'cancelled' as const }
              : booking
          )
        );
      }
      return success;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return false;
    }
  };

  return {
    bookings,
    isLoading,
    error,
    cancelBooking,
    refreshBookings: fetchBookings
  };
}