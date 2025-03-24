import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, collections } from '../lib/firebase';
import type { Booking } from '../types/booking';
import { firebaseAuthService } from './firebaseAuthService';

class FirebaseBookingService {
  async getBookings(userId?: string, role?: string): Promise<Booking[]> {
    try {
      const currentUser = firebaseAuthService.getCurrentUser();
      if (!currentUser || !userId || !role) {
        throw new Error('User not authenticated');
      }

      const bookingsRef = collection(db, collections.bookings);
      const q = query(
        bookingsRef,
        role === 'pandit' 
          ? where('panditId', '==', userId)
          : where('devoteeId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          date: data.date || data.ceremony_date,
          time: data.time || data.ceremony_time,
          messages: data.messages || []
        } as Booking;
      });
      
      return bookings;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  }

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const currentUser = firebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const bookingRef = await addDoc(collection(db, collections.bookings), {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'pending'
      });

      const booking = {
        id: bookingRef.id,
        ...bookingData,
        createdAt: new Date().toISOString(),
        messages: []
      };

      return booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled'): Promise<boolean> {
    try {
      const currentUser = firebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const bookingRef = doc(db, collections.bookings, bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Failed to update booking status:', error);
      return false;
    }
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }
}

export const firebaseBookingService = new FirebaseBookingService();