import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import type { Review, ReviewStats } from '../../types/review';

interface ReviewListProps {
  panditId: string;
}

export function ReviewList({ panditId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [panditId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const [reviewsData, statsData] = await Promise.all([
        reviewService.getReviewsForPandit(panditId),
        reviewService.getReviewStats(panditId)
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (!stats || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.totalReviews} reviews
          </div>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratings[rating] || 0;
            const percentage = (count / stats.totalReviews) * 100;
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <div className="w-12">{rating} stars</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right text-gray-500">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{review.userName}</span>
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-gray-700">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}