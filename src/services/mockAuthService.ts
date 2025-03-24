class MockAuthService {
  private readonly USERS_KEY = 'registered_users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly ADMIN_EMAIL = 'admin@panditji.com';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor() {
    // Initialize admin user if not exists
    const users = this.getStoredUsers();
    if (!users.some(user => user.email === this.ADMIN_EMAIL)) {
      users.push({
        email: this.ADMIN_EMAIL,
        password: this.ADMIN_PASSWORD,
        name: 'Admin',
        role: 'admin'
      });
      this.setStoredUsers(users);
    }
  }

  getStoredUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private setStoredUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  async register(name: string, email: string, password: string, role: 'user' | 'pandit' = 'user', profile?: any) {
    if (email === this.ADMIN_EMAIL) {
      throw new Error('Email not available');
    }

    const users = this.getStoredUsers();
    
    if (users.some(user => user.email === email)) {
      throw new Error('User already exists');
    }

    // Validate required fields for pandit
    if (role === 'pandit') {
      if (!profile?.languages?.length) {
        throw new Error('Languages are required for pandit registration');
      }
      if (!profile?.specializations?.length) {
        throw new Error('Specializations are required for pandit registration');
      }
    }

    const newUser = { 
      email, 
      password, 
      name, 
      role,
      disabled: false,
      profile: role === 'pandit' ? {
        languages: profile?.languages || ['Hindi', 'Sanskrit'],
        specializations: profile?.specializations || ['Puja', 'Wedding Ceremony'],
        experience: profile?.experience || '0',
        phone: profile?.phone || '',
        location: profile?.location || '',
        avatarUrl: profile?.avatarUrl || '',
        bio: profile?.bio || '',
        specializationCosts: {},
        rating: (3.5 + Math.random() * 1.5), // Random rating between 3.5 and 5
        reviewCount: Math.floor(5 + Math.random() * 45) // Random number of reviews between 5 and 50
      } : {
        avatarUrl: profile?.avatarUrl || '',
        phone: profile?.phone || '',
        location: profile?.location || ''
      }
    };
    
    users.push(newUser);
    this.setStoredUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return { id: email, ...userWithoutPassword };
  }

  async login(email: string, password: string) {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.disabled) {
      throw new Error('Account is disabled');
    }

    const { password: _, ...userWithoutPassword } = user;
    const currentUser = { id: email, ...userWithoutPassword };
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    return currentUser;
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  async disableUser(email: string): Promise<void> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].disabled = !users[userIndex].disabled;
    this.setStoredUsers(users);

    // If the disabled user is currently logged in, log them out
    const currentUser = this.getCurrentUser();
    if (currentUser?.email === email) {
      this.logout();
    }
  }
}

export const mockAuthService = new MockAuthService();