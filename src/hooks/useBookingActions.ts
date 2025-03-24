import { useState } from 'react';
import { bookingService } from '../services/bookingService';

export function useBookingActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (bookingId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await bookingService.cancelBooking(bookingId);
      return success;
    } catch (err) {
      setError('Failed to cancel booking');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelBooking,
    isLoading,
    error
  };
}