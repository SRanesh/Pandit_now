import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, Languages, Award, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { MessageModal } from './MessageModal';

interface BookingDetails {
  id: string;
  ceremony: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  panditName?: string;
  devoteeName?: string;
  contactDetails: {
    email: string;
    phone: string;
  };
  notes?: string;
  selectedOptions?: {
    languages?: string[];
    specializations?: string[];
  };
}

interface BookingDetailsModalProps {
  booking: BookingDetails;
  onClose: () => void;
  onUpdate: () => void;
}

export function BookingDetailsModal({ booking, onClose, onUpdate }: BookingDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false); 
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { user } = useAuth();

  // Show pandit details to devotee and devotee details to pandit
  const isDevotee = user?.role !== 'pandit';
  const contactDetails = {
    name: isDevotee ? booking.panditName : booking.devoteeName,
    email: isDevotee ? booking.panditEmail : booking.devoteeEmail,
    phone: isDevotee ? booking.panditPhone : booking.devoteePhone,
    role: isDevotee ? 'Pandit' : 'Devotee'
  };

  // Format date to be more readable
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const success = await bookingService.updateBookingStatus(booking.id, 'confirmed');
      if (success) {
        onUpdate();
        onClose();
      }
      setShowMessageModal(true); // Show message modal after accepting
    } catch (error) {
      console.error('Failed to accept booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await bookingService.updateBookingStatus(booking.id, 'cancelled');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to decline booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                {booking.ceremony}
              </h3>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="bg-orange-50 rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{booking.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm break-words">{booking.location}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-900">{contactDetails.role}:</span>
                <span className="text-sm text-gray-600 ml-1">{contactDetails.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">
                  {contactDetails.phone || 'Phone not provided'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600 break-words">
                  {contactDetails.email}
                </span>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}

          {booking.selectedOptions && (
            <div className="space-y-4">
              {booking.selectedOptions.languages && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {booking.selectedOptions.languages.map(lang => (
                      <span key={lang} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {booking.selectedOptions.specializations && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Specializations</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {booking.selectedOptions.specializations.map(spec => (
                      <span key={spec} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {booking.notes && (
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          {booking.status === 'pending' && (
            <>
              <Button 
                variant="secondary" 
                className="text-red-600 hover:text-red-700"
                onClick={handleDecline}
                isLoading={isLoading}
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                isLoading={isLoading}
              >
                Accept
              </Button>
            </>
          )}
        </div>
      </div>
      
      {showMessageModal && (
        <MessageModal
          booking={booking}
          onClose={() => setShowMessageModal(false)}
          onMessageSent={onUpdate}
        />
      )}
    </div>
  );
}