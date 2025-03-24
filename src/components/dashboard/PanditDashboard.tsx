import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Filter } from 'lucide-react';
import { usePandits } from '../../hooks/usePandits';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';

// Helper function to get today's ceremonies based on Panchang
function getTodayCeremonies() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Daily ceremonies and rituals
  const dailyCeremonies = [
    { name: 'Sandhya Vandanam', time: '6:00 AM - 7:00 AM', type: 'Daily Ritual' },
    { name: 'Surya Namaskar', time: '7:00 AM - 7:30 AM', type: 'Daily Ritual' }
  ];

  // Special ceremonies based on weekday
  const weekdayCeremonies = {
    0: [{ name: 'Surya Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Sunday
    1: [{ name: 'Shiva Abhishekam', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Monday
    2: [{ name: 'Hanuman Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Tuesday
    3: [{ name: 'Krishna Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Wednesday
    4: [{ name: 'Vishnu Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Thursday
    5: [{ name: 'Lakshmi Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }], // Friday
    6: [{ name: 'Shani Puja', time: '8:00 AM - 9:00 AM', type: 'Weekly Ritual' }]  // Saturday
  };

  // Combine daily and weekday-specific ceremonies
  return [...dailyCeremonies, ...weekdayCeremonies[dayOfWeek]];
}

export function PanditDashboard() {
  const todayCeremonies = getTodayCeremonies();
  const { pandits, activeFilters } = usePandits();
  const { user } = useAuth();
  const [reviewStats, setReviewStats] = useState({ rating: 0, reviewCount: 0 });
  const [userRatings, setUserRatings] = useState<{[key: number]: number}>({});

  useEffect(() => {
    if (user?.id) {
      loadReviewStats();
    }
  }, [user]);

  const loadReviewStats = async () => {
    if (!user?.id) return;
    try {
      const { averageRating, totalReviews, ratings } = await reviewService.getReviewStats(user.id);
      setReviewStats({
        rating: averageRating,
        reviewCount: totalReviews
      });
      setUserRatings(ratings);
    } catch (error) {
      console.error('Failed to load review stats:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Today's Ceremonies</h3>
          </div>
          {todayCeremonies.length > 0 ? (
            <div className="space-y-3">
              {todayCeremonies.map((ceremony, index) => (
                <div key={index} className="border-l-2 border-orange-500 pl-3">
                  <p className="font-medium text-gray-900">{ceremony.name}</p>
                  <p className="text-sm text-gray-500">{ceremony.time}</p>
                  <p className="text-xs text-gray-500">{ceremony.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ceremonies scheduled for today</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Filtered Pandits</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pandits.length}</p>
          {activeFilters && (
            <div className="mt-2 space-y-2">
              {activeFilters.location && (
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Location: {activeFilters.location}</span>
                </div>
              )}
              {activeFilters.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activeFilters.services.map(service => (
                    <span key={service} className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              )}
              {activeFilters.languages.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activeFilters.languages.map(language => (
                    <span key={language} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              )}
              {activeFilters.minExperience > 0 && (
                <p className="text-sm text-gray-600">
                  Min. Experience: {activeFilters.minExperience} years
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Rating</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{reviewStats.rating.toFixed(1)}</p>
            <div className="flex items-center">
              <div className="flex flex-col gap-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = userRatings[rating] || 0;
                  const percentage = reviewStats.reviewCount ? (count / reviewStats.reviewCount) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 w-16">
                        <span>{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {reviewStats.reviewCount} {reviewStats.reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {activeFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Filtered Pandit List</h3>
          <div className="space-y-4">
            {pandits.map((pandit) => (
              <div key={pandit.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <h4 className="font-medium text-gray-900">{pandit.name}</h4>
                  <p className="text-sm text-gray-500">{pandit.location}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pandit.specializations.slice(0, 3).map(spec => (
                      <span key={spec} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                        {spec}
                      </span>
                    ))}
                    {pandit.specializations.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                        +{pandit.specializations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{pandit.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{pandit.experience} years exp.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}