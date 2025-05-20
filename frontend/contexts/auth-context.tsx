"use client";
// contexts/auth-context.tsx の改善版
import { User as SupabaseUser, Session, createClient } from '@supabase/supabase-js';
import { getMyProfile } from '@/lib/supabase/queries';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Profile {
  id: string;
  fullName: string;
  companyName?: string;
  role: 'admin' | 'client';
  created_at?: string;
  updated_at?: string;
  clinicName?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'admin' | 'client') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const userProfile = await getMyProfile();
            setProfile(userProfile);
            setError(null);
          } catch (error: any) {
            console.error('Error fetching profile in AuthContext (raw):', error);
            if (error && typeof error === 'object') {
              console.error('Error fetching profile in AuthContext (details):', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                fullError: JSON.stringify(error, null, 2)
              });
            }
            setProfile(null);
            setError(error as Error);
          }
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const register = async (email: string, password: string, fullName: string, role: 'admin' | 'client') => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role: role,
        });

      if (profileError) throw profileError;
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    }
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error("User not authenticated");
    setIsLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      setError(error);
      setIsLoading(false);
      throw error;
    }
    try {
      const updatedProfile = await getMyProfile();
      setProfile(updatedProfile);
    } catch (fetchError) {
      console.error('Error refetching profile:', fetchError);
      setError(fetchError as Error);
    }
    setIsLoading(false);
  };

  const value = {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user && !!profile,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};