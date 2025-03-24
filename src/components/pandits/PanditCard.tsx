import React, { useState, useEffect } from 'react';
import { MapPin, Languages, Award, Star, StarHalf, PenLine } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingModal } from './BookingModal';
import { UserAvatar } from '../UserAvatar';
import { ReviewModal } from '../reviews/ReviewModal';
import { ReviewList } from '../reviews/ReviewList';
import { useAuth } from '../../hooks/useAuth';
import { reviewService } from '../../services/reviewService';

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

interface PanditCardProps {
  pandit: {
    id: string;
    name: string;
    location: string;
    experience: string;
    languages: string[];
    specializations: string[];
    rating: number;
    reviewCount: number;
    specializationCosts?: { [key: string]: string };
    profile?: {
      avatarUrl?: string;
      bio?: string;
      specializationCosts?: { [key: string]: string };
    };
  };
  onBook: (panditId: string) => void;
}

export function PanditCard({ pandit, onBook }: PanditCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    rating: pandit.rating,
    reviewCount: pandit.reviewCount
  });
  const { user } = useAuth();

  useEffect(() => {
    loadReviewStats();
  }, [pandit.id]);

  const loadReviewStats = async () => {
    try {
      const stats = await reviewService.getReviewStats(pandit.id);
      setReviewStats({
        rating: stats.averageRating,
        reviewCount: stats.totalReviews
      });
    } catch (error) {
      console.error('Failed to load review stats:', error);
    }
  };
  const handleReviewSubmitted = () => {
    loadReviewStats();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4 mb-4">
          <UserAvatar 
            user={{ 
              ...pandit, 
              email: pandit.id,
              role: 'pandit',
              profile: pandit.profile
            }} 
            size="lg" 
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pandit.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <StarRating rating={reviewStats.rating} />
                  <span className="ml-1">{reviewStats.rating.toFixed(1)}</span>
                  <button 
                    onClick={() => setShowReviews(!showReviews)}
                    className="hover:text-orange-600"
                  >
                    ({reviewStats.reviewCount} reviews)
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                {user?.role === 'user' && (
                  <Button 
                    variant="secondary"
                    onClick={() => setShowReviewModal(true)}
                    className="p-2"
                    title="Write Review"
                  >
                    <PenLine className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={() => setShowBookingModal(true)}>Book Now</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{pandit.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4" />
            <span>{pandit.experience} years of experience</span>
          </div>
        </div>

        {pandit.profile?.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pandit.profile.bio}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {pandit.languages.map(lang => (
                <span key={lang} className="text-sm px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {pandit.specializations.map(spec => (
              <span key={spec} className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>
        
        {showReviews && (
          <div className="mt-6 pt-6 border-t">
            <ReviewList panditId={pandit.id} />
          </div>
        )}
      </div>

      {showBookingModal && (
        <BookingModal
          pandit={{
            id: pandit.id,
            name: pandit.name,
            specializations: pandit.specializations,
            languages: pandit.languages,
            specializationCosts: pandit.profile?.specializationCosts
          }}
          onClose={() => setShowBookingModal(false)}
          onBook={onBook}
        />
      )}
      
      {showReviewModal && (
        <ReviewModal
          panditId={pandit.id}
          panditName={pandit.name}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
}