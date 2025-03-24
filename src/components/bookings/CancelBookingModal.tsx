import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface CancelBookingModalProps {
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function CancelBookingModal({ onConfirm, onClose, isLoading }: CancelBookingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Cancel Booking</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Keep Booking
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            isLoading={isLoading}
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
}