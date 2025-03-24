import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';
import { AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, profile?: any) => Promise<void>;
  signupAsPandit: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { 
    name: string; 
    phone?: string; 
    location?: string; 
    avatarUrl?: string;
    experience?: string;
    bio?: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || '',
          role: session.user.user_metadata?.role || 'devotee',
          profile: {
            phone: session.user.user_metadata?.phone,
            location: session.user.user_metadata?.location,
            avatarUrl: session.user.user_metadata?.avatar_url,
            experience: session.user.user_metadata?.experience,
            languages: session.user.user_metadata?.languages || [],
            specializations: session.user.user_metadata?.specializations || [],
            bio: session.user.user_metadata?.bio
          }
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || '',
          role: session.user.user_metadata?.role || 'devotee',
          profile: {
            phone: session.user.user_metadata?.phone,
            location: session.user.user_metadata?.location,
            avatarUrl: session.user.user_metadata?.avatar_url,
            experience: session.user.user_metadata?.experience,
            languages: session.user.user_metadata?.languages || [],
            specializations: session.user.user_metadata?.specializations || [],
            bio: session.user.user_metadata?.bio
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
    
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, profile?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'devotee',
            phone: profile?.phone || '',
            location: profile?.location || '',
            avatar_url: profile?.avatarUrl || '',
            languages: [],
            specializations: []
          }
        }
      });
    
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.message.includes('already exists')) {
          throw new Error('Email already in use');
        }
      }
      throw error;
    }
  };

  const signupAsPandit = async (userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: 'pandit',
            phone: userData.phone || '',
            location: userData.location || '',
            experience: userData.experience || '0',
            languages: userData.languages || [],
            specializations: userData.specializations || [],
            bio: userData.bio || ''
          }
        }
      });
    
      if (error) {
        console.error('Pandit signup error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.message.includes('already exists')) {
          throw new Error('Email already in use');
        }
      }
      throw error;
    }
  };

  const logout = () => {
    try {
      supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: { 
    name: string; 
    phone?: string; 
    location?: string; 
    avatarUrl?: string;
    experience?: string;
    bio?: string;
    specializationCosts?: { [key: string]: string };
  }) => {
    if (!user) return;
    
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        phone: data.phone,
        location: data.location,
        avatar_url: data.avatarUrl,
        experience: data.experience,
        bio: data.bio,
        specialization_costs: data.specializationCosts
      }
    });
    
    if (error) throw error;

    // Update local user state with new data
    setUser({
      ...user,
      name: data.name,
      profile: {
        ...user.profile,
        phone: data.phone || user.profile?.phone,
        location: data.location || user.profile?.location,
        avatarUrl: data.avatarUrl || user.profile?.avatarUrl,
        experience: data.experience || user.profile?.experience,
        bio: data.bio || user.profile?.bio,
        specializationCosts: data.specializationCosts || user.profile?.specializationCosts
      }
    });
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    signup,
    signupAsPandit,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}