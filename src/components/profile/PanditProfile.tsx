import React, { useState } from 'react';
import { PanditProfile as PanditProfileType } from '../../types/auth';
import { Phone, Calendar, Languages, Award, MapPin, Clock, FileText, Edit2, Star, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { ReviewList } from '../reviews/ReviewList';
import { supabase } from '../../lib/supabase';

interface Booking {
  id: string;
  ceremony: string;
  ceremony_date: string;
  ceremony_time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  devotee: {
    name: string;
    phone: string;
  };
}

interface EditBioModalProps {
  currentBio: string;
  onSave: (bio: string) => void;
  onClose: () => void;
}

function EditBioModal({ currentBio, onSave, onClose }: EditBioModalProps) {
  const [bio, setBio] = useState(currentBio);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(bio);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Edit About Me</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            rows={6}
            placeholder="Tell devotees about yourself, your expertise, and your approach to ceremonies..."
          />
          <div className="flex justify-end gap-3 mt-4">
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PanditProfileProps {
  profile?: PanditProfileType;
  onUpdateBio?: (bio: string) => Promise<void>;
}

export function PanditProfile({ profile, onUpdateBio }: PanditProfileProps) {
  const [showBioModal, setShowBioModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  React.useEffect(() => {
    if (profile?.id) {
      loadBookings();
    }
  }, [profile?.id]);

  const loadBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          ceremony,
          ceremony_date,
          ceremony_time,
          location,
          status,
          devotee:devotee_id (
            name,
            phone
          )
        `)
        .eq('pandit_id', profile?.id)
        .order('ceremony_date', { ascending: true });

      if (bookingsError) throw bookingsError;

      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  if (!profile) return null;

  const rating = profile.rating || 0;
  const reviewCount = profile.reviewCount || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <div className="text-sm text-gray-500">
              Member since {new Date().getFullYear()}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : star <= rating + 0.5
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-2xl font-bold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-lg font-medium text-gray-700 mt-1">
              {reviewCount.toLocaleString()} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Phone</h3>
              <p className="text-gray-500">{profile.phone || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Years of Experience</h3>
              <p className="text-gray-500">{profile.experience} years</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Location</h3>
              <p className="text-gray-500">{profile.location || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Expertise</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Languages className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.languages && profile.languages.length > 0 ? (
                profile.languages.map(lang => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No languages specified</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Specializations & Costs</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specializations && profile.specializations.length > 0 ? (
                profile.specializations.map(spec => (
                  <div
                    key={spec}
                    className="flex items-center gap-2 bg-orange-50 p-2 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{spec}</p>
                      <p className="text-sm text-orange-600">
                        ₹{profile.specializationCosts?.[spec] || 'Not set'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No specializations specified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-gray-400 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">About Me</h3>
              {onUpdateBio && (
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => setShowBioModal(true)}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Bio
                </Button>
              )}
            </div>
            <p className="text-gray-500 whitespace-pre-wrap mt-2">
              {profile.bio || 'No bio provided yet'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bookings Section */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-6">Upcoming Bookings</h2>
        
        {isLoadingBookings ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{booking.ceremony}</h3>
                    <p className="text-sm text-gray-500">
                      Devotee: {booking.devotee.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(booking.ceremony_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{booking.ceremony_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{booking.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="text-sm text-gray-500">
            Total: {reviewCount.toLocaleString()}
          </div>
        </div>
        <ReviewList panditId={profile.id || ''} />
      </div>

      {showBioModal && onUpdateBio && (
        <EditBioModal
          currentBio={profile.bio || ''}
          onSave={onUpdateBio}
          onClose={() => setShowBioModal(false)}
        />
      )}
    </div>
  );
}