import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { messageService } from '../../services/messageService';
import type { Booking } from '../../types/booking';

interface MessageModalProps {
  booking: Booking;
  onClose: () => void;
  onMessageSent: () => void;
}

export function MessageModal({ booking, onClose, onMessageSent }: MessageModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setIsLoading(true);
    try {
      await messageService.sendMessage({
        bookingId: booking.id,
        senderId: user.id,
        senderName: user.name,
        message: message.trim(),
        recipientId: user.role === 'pandit' ? booking.devoteeId : booking.panditId,
        recipientName: user.role === 'pandit' ? booking.devoteeName : booking.panditName
      });
      onMessageSent();
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-1">
              {user?.role === 'pandit' ? 'To Devotee' : 'To Pandit'}: {user?.role === 'pandit' ? booking.devoteeName : booking.panditName}
            </h3>
            <p className="text-sm text-gray-500">
              Regarding: {booking.ceremony} on {booking.date} at {booking.time}
            </p>
          </div>

          {booking.messages && booking.messages.length > 0 && (
            <div className="mb-6 space-y-4 max-h-60 overflow-y-auto">
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
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              required
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}