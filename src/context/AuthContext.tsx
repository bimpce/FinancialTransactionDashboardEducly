import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_DEMO_USER_KEY = 'demo_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to get Supabase session:', err);
        setLoading(false);
      });

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback if Supabase credentials have not yet been provided in Settings
      const savedUser = localStorage.getItem(LOCAL_STORAGE_DEMO_USER_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_DEMO_USER_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email });
          setSession(data.session);
          return { success: true };
        }

        return { success: false, error: 'User could not be authenticated.' };
      } catch (err: any) {
        return { success: false, error: err?.message || 'An unexpected error occurred.' };
      }
    } else {
      // Supabase credentials not yet configured
      // Allow fallback sign-in so user can test the app before setting up their Supabase project
      if (!email.trim() || !password) {
        return { success: false, error: 'Please provide both email and password.' };
      }
      const demoUser: AuthUser = {
        id: 'mock-user-1',
        email: email.trim(),
      };
      localStorage.setItem(LOCAL_STORAGE_DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DEMO_USER_KEY);
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
