import { Review, ReviewStats } from '../types/review';
import { localStorageService } from './localStorageService';

class ReviewService {
  private readonly REVIEWS_KEY = 'pandit_reviews';

  private getStoredReviews(): Review[] {
    const reviews = localStorage.getItem(this.REVIEWS_KEY);
    return reviews ? JSON.parse(reviews) : [];
  }

  private setStoredReviews(reviews: Review[]): void {
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
  }

  async getReviewsForPandit(panditId: string): Promise<Review[]> {
    const reviews = this.getStoredReviews();
    return reviews
      .filter(review => review.panditId === panditId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getReviewStats(panditId: string, reviewsList?: Review[]): Promise<ReviewStats> {
    const reviews = reviewsList || await this.getReviewsForPandit(panditId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const ratings = reviews.reduce((acc, review) => {
      const rating = Math.round(review.rating);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return {
      averageRating,
      totalReviews: reviews.length,
      ratings
    };
  }

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const reviews = this.getStoredReviews();
    
    // Remove any existing review by this user for this pandit
    const filteredReviews = reviews.filter(
      r => !(r.panditId === review.panditId && r.userId === review.userId)
    );

    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    filteredReviews.push(newReview);
    this.setStoredReviews(filteredReviews);

    // Update pandit's rating in users storage
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const panditIndex = users.findIndex((u: any) => u.email === review.panditId);
    
    if (panditIndex !== -1) {
      const stats = await this.getReviewStats(review.panditId, filteredReviews);
      users[panditIndex].profile.rating = stats.averageRating;
      users[panditIndex].profile.reviewCount = stats.totalReviews;
      localStorage.setItem('registered_users', JSON.stringify(users));
    }

    return newReview;
  }
}

export const reviewService = new ReviewService();