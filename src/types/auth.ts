export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'pandit' | 'admin';
  profile?: PanditProfile;
}

export interface PanditProfile {
  phone: string;
  experience: string;
  languages: string[];
  specializations: string[];
  specializationCosts: { [key: string]: string };
  location?: string;
  avatarUrl?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signupAsPandit: (data: PanditSignUpData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

export interface PanditSignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  experience: string;
  location?: string;
  specializationCosts: { [key: string]: string };
  languages: string[];
  specializations: string[];
}

export interface ProfileUpdateData {
  name: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  experience?: string;
  bio?: string;
}