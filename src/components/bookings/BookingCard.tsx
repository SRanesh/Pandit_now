import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Languages, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingDetailsModal } from './BookingDetailsModal';
import { CancelBookingModal } from './CancelBookingModal';
import { RescheduleModal } from './RescheduleModal';
import { MessageModal } from './MessageModal';
import { useAuth } from '../../hooks/useAuth';
import type { Booking } from '../../types/booking';

interface BookingCardProps {
  booking: Booking;
  onUpdate: () => void;
  onCancel: (bookingId: string) => Promise<boolean>;
}

export function BookingCard({ booking, onUpdate, onCancel }: BookingCardProps) {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessageTab, setShowMessageTab] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDevotee = user?.role !== 'pandit';
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  // Format date to be more readable
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const success = await onCancel(booking.id);
      if (success) {
        setShowCancelModal(false);
        onUpdate();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canModify = booking.status === 'confirmed' || booking.status === 'pending';
  const isPandit = user?.role === 'pandit';

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.ceremony}
              </h3>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="flex gap-2">
            {canModify && (
              <>
                {booking.status === 'confirmed' && (
                  <>
                    <Button 
                      variant="secondary" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setShowRescheduleModal(true)}
                    >
                      Reschedule
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="secondary" onClick={() => setShowDetails(true)}>
              View Details
            </Button>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Date</p>
                <p className="text-gray-900">{formattedDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Time</p>
                <p className="text-gray-900">{booking.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-gray-900 break-words">{booking.location}</p>
              </div>
            </div>
          </div>
        </div>

        {booking.selectedOptions && (
          <div className="space-y-3">
            {booking.selectedOptions.languages && (
              <div className="flex items-start gap-2">
                <Languages className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex flex-wrap gap-1">
                  {booking.selectedOptions.languages.map(lang => (
                    <span key={lang} className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {booking.selectedOptions.specializations && (
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex flex-wrap gap-1">
                  {booking.selectedOptions.specializations.map(spec => (
                    <span key={spec} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowMessageTab(!showMessageTab)}
            className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900"
          >
            <span className="font-medium">Messages</span>
            {showMessageTab ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {showMessageTab && (
            <div className="mt-4">
              {booking.messages && booking.messages.length > 0 ? (
                <div className="space-y-3">
                  {booking.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.senderId === user?.id
                          ? 'bg-orange-50 ml-8'
                          : 'bg-gray-50 mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          {msg.senderId === user?.id ? 'You' : msg.senderName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No messages yet. Start a conversation!
                </p>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => setShowMessageModal(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {isDevotee ? `Pandit: ${booking.panditName}` : `Devotee: ${booking.devoteeName}`}
          </span>
        </div>
      </div>

      {showDetails && (
        <BookingDetailsModal 
          booking={booking} 
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
        />
      )}

      {showCancelModal && (
        <CancelBookingModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          isLoading={isLoading}
        />
      )}

      {showRescheduleModal && (
        <RescheduleModal
          onConfirm={async () => {}}
          onClose={() => setShowRescheduleModal(false)}
          isLoading={false}
        />
      )}
      
      {showMessageModal && (
        <MessageModal
          booking={booking}
          onClose={() => setShowMessageModal(false)}
          onMessageSent={onUpdate}
        />
      )}
    </>
  );
}