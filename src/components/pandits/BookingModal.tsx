import React, { useState } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAuth } from '../../hooks/useAuth';

interface BookingModalProps {
  pandit: {
    id: string;
    name: string;
    specializations: string[];
    languages: string[];
    specializationCosts?: { [key: string]: string };
  };
  onClose: () => void;
  onBook: (panditId: string, bookingData: any) => void;
}

export function BookingModal({ pandit, onClose, onBook }: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ceremony: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  const handleCeremonyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ceremony = e.target.value;
    setFormData(prev => ({
      ...prev,
      ceremony
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    try {
      if (!user) throw new Error('User not authenticated');
      await onBook(pandit.id, {
        ...formData,
        devoteeId: user.id,
        devoteeName: user.name,
        panditName: pandit.name,
        status: 'pending',
        contactDetails: {
          email: user.email,
          phone: user.profile?.phone || ''
        },
        selectedOptions: {
          languages: pandit.languages,
          specializations: pandit.specializations,
        },
        createdAt: new Date().toISOString()
      });

      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Book Ceremony with {pandit.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ceremony Type
            </label>
            <div className="space-y-2">
              <Select
                options={[
                  { value: '', label: 'Select a ceremony' },
                  ...pandit.specializations.map(spec => ({ value: spec, label: spec }))
                ]}
                value={formData.ceremony}
                onChange={(e) => handleCeremonyChange(e)}
                required
              />
              {formData.ceremony && (
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Cost:</span>
                  <span className="text-sm text-orange-600 font-medium">
                    To be discussed with Pandit
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              placeholder="Any special requirements or notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}