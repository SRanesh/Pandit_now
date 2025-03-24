interface StorageData {
  users: any[];
  bookings: any[];
  reviews: any[];
  messages: any[];
}

class LocalStorageService {
  private readonly STORAGE_KEY = 'panditji_data';
  private readonly BOOKINGS_KEY = 'user_bookings';

  private getStorageData(): StorageData {
    const defaultData = {
      users: [],
      bookings: [],
      reviews: [],
      messages: []
    };

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : defaultData;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultData;
    }
  }

  private setStorageData(data: StorageData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // User methods
  getUsers(): any[] {
    return this.getStorageData().users;
  }

  addUser(user: any): void {
    const data = this.getStorageData();
    data.users.push(user);
    this.setStorageData(data);
  }

  updateUser(userId: string, updates: any): void {
    const data = this.getStorageData();
    data.users = data.users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    this.setStorageData(data);
  }

  // Booking methods
  getBookings(userId?: string, role?: string): any[] {
    const bookings = localStorage.getItem(this.BOOKINGS_KEY);
    let storedBookings = bookings ? JSON.parse(bookings) : [];
    
    if (!userId || !role) {
      return storedBookings;
    }
    
    return storedBookings
      .filter(booking => 
        role === 'pandit' ? booking.panditId === userId : booking.devoteeId === userId
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  setBookings(bookings: any[]): void {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  }

  addBooking(booking: any): void {
    const data = this.getStorageData();
    data.bookings.push({
      ...booking,
      createdAt: new Date().toISOString()
    });
    this.setStorageData(data);
  }

  updateBooking(bookingId: string, updates: any): void {
    const data = this.getStorageData();
    const bookingIndex = data.bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
      data.bookings[bookingIndex] = {
        ...data.bookings[bookingIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    
    this.setStorageData(data);
  }

  // Review methods
  getReviews(): any[] {
    return this.getStorageData().reviews;
  }

  addReview(review: any): void {
    const data = this.getStorageData();
    data.reviews.push(review);
    this.setStorageData(data);
  }

  // Message methods
  getMessages(): any[] {
    return this.getStorageData().messages;
  }

  addMessage(message: any): void {
    const data = this.getStorageData();
    data.messages.push(message);
    this.setStorageData(data);
  }

  // Clear all data
  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const localStorageService = new LocalStorageService();