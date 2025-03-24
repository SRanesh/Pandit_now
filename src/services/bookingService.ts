import { Booking } from '../types/booking';
import { localStorageService } from './localStorageService';
import { mockAuthService } from './mockAuthService';

const BOOKINGS_KEY = 'user_bookings';

class BookingService {
  async getBookings(): Promise<Booking[]> {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      if (!currentUser) throw new Error('User not authenticated');

      // Get all bookings
      const bookings = localStorage.getItem('user_bookings');
      if (!bookings) return [];
      
      const allBookings = JSON.parse(bookings);
      
      // Filter based on user role
      return allBookings.filter((booking: Booking) => 
        currentUser.role === 'pandit' 
          ? booking.panditId === currentUser.id 
          : booking.devoteeId === currentUser.id
      ).sort((a: Booking, b: Booking) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      const pandit = mockAuthService.getStoredUsers()
        .find(user => user.email === bookingData.panditId);
      
      if (!currentUser || !pandit) {
        throw new Error('Invalid booking data');
      }

      const booking = {
        id: Date.now().toString(),
        ...bookingData,
        panditEmail: pandit.email,
        panditPhone: pandit.profile?.phone || '',
        devoteeEmail: currentUser.email,
        devoteePhone: currentUser.profile?.phone || '',
        messages: []
      };

      // Get existing bookings or initialize empty array
      const existingBookings = localStorage.getItem('user_bookings');
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];
      
      // Add new booking
      bookings.push(booking);
      
      // Save updated bookings
      localStorage.setItem('user_bookings', JSON.stringify(bookings));
      
      return booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled'): Promise<boolean> {
    try {
      const bookings = localStorageService.getBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) return false;
      
      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      localStorageService.setBookings(bookings);
      return true;
    } catch (error) {
      console.error('Failed to update booking status:', error);
      return false;
    }
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }

  async sendMessage(bookingId: string, messageData: {
    senderId: string;
    senderName: string;
    message: string;
  }): Promise<void> {
    const bookings = localStorageService.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    const booking = bookings[bookingIndex];
    if (!booking.messages) {
      booking.messages = [];
    }
    
    booking.messages.push({
      id: Date.now().toString(),
      ...messageData,
      timestamp: new Date().toISOString()
    });
    
    localStorageService.setBookings(bookings);
  }
}

export const bookingService = new BookingService();