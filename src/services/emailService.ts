import { supabase } from '../lib/supabase';

export class EmailService {
  async sendBookingNotification(
    panditEmail: string,
    bookingDetails: {
      devoteeName: string;
      ceremony: string;
      date: string;
      time: string;
      location: string;
    }
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: panditEmail,
          subject: 'New Booking Request',
          template: 'booking-request',
          bookingDetails
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to send booking notification:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(
    devoteeEmail: string,
    bookingDetails: {
      panditName: string;
      ceremony: string;
      date: string;
      time: string;
      location: string;
    }
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: devoteeEmail,
          subject: 'Booking Confirmation',
          template: 'booking-confirmation',
          bookingDetails
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
      throw error;
    }
  }

  async sendBookingCancellation(
    email: string,
    isDevotee: boolean,
    bookingDetails: {
      ceremony: string;
      date: string;
      time: string;
      counterpartyName: string;
    }
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: email,
          subject: 'Booking Cancelled',
          template: 'booking-cancellation',
          bookingDetails,
          userType: isDevotee ? 'devotee' : 'pandit'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to send cancellation notification:', error);
      throw error;
    }
  }
}