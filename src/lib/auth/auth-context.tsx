'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  isSupabaseConnected: boolean;
}

const AUTH_STORAGE_KEY = 'slash_auth_user_v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  authLoading: true,
  login: async () => {},
  signUp: async () => {},
  loginWithGoogle: async () => {},
  loginAsDemo: () => {},
  logout: async () => {},
  isSupabaseConnected: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const isSupabaseConnected = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    if (isSupabaseConnected) {
      const supabase = createClient();
      if (supabase) {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!mounted) return;
          if (session?.user) {
            const authUser: User = {
              id: session.user.id,
              email: session.user.email || 'user@slash.app',
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              plan: 'Pro Plan',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          }
          setAuthLoading(false);
        }).catch(() => {
          if (mounted) setAuthLoading(false);
        });

        // Auth state listener (handles Google OAuth redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const authUser: User = {
              id: session.user.id,
              email: session.user.email || 'user@slash.app',
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              plan: 'Pro Plan',
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          } else {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            setUser(stored ? JSON.parse(stored) : null);
          }
          setAuthLoading(false);
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      }
    }

    // Local Storage fallback
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
    setAuthLoading(false);
  }, [isSupabaseConnected]);

  const login = async (email: string, password?: string) => {
    if (isSupabaseConnected && password) {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        return;
      }
    }

    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name: email.split('@')[0],
      plan: 'Pro Plan',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const signUp = async (email: string, password?: string) => {
    if (isSupabaseConnected && password) {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        return;
      }
    }

    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name: email.split('@')[0],
      plan: 'Pro Plan',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConnected) {
      const supabase = createClient();
      if (supabase) {
        const origin = typeof window !== 'undefined' 
          ? window.location.origin 
          : process.env.NEXT_PUBLIC_SITE_URL || 'https://slash-urlshortner.vercel.app';
          
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/dashboard`,
          },
        });
        if (error) throw error;
        return;
      }
    }

    loginAsDemo();
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'usr_demo_stripe',
      email: 'alex@slash.app',
      name: 'Alex Vance',
      plan: 'Pro Plan',
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    router.push('/dashboard');
  };

  const logout = async () => {
    if (isSupabaseConnected) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        login,
        signUp,
        loginWithGoogle,
        loginAsDemo,
        logout,
        isSupabaseConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
