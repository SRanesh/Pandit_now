export interface Review {
  id: string;
  panditId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratings: {
    [key: number]: number; // Distribution of ratings (1-5 stars)
  };
}