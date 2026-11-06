import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User } from '../types';
import { getSupabaseClient, isRealSupabaseConnected } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  isLiveSupabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'taskflow_auth_users';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'taskflow_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const isLiveSupabase = isRealSupabaseConnected();

  // Initialize session
  useEffect(() => {
    async function initSession() {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session?.user && !error) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || '/src/assets/images/avatar_user_profile_1793946784815.jpg',
              created_at: session.user.created_at,
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Error checking Supabase auth session, falling back to local session:', err);
        }
      }

      // Local storage fallback
      const savedUserStr = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        }
      }
      setLoading(false);
    }

    initSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Email and password are required.' };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const appUser: User = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url || '/src/assets/images/avatar_user_profile_1793946784815.jpg',
            created_at: data.user.created_at,
          };
          setUser(appUser);
          localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(appUser));
          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Failed to sign in via Supabase' };
      }
    }

    // Local authentication engine
    const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: Array<User & { passwordHash: string }> = usersJson ? JSON.parse(usersJson) : [];

    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, error: 'No account found with this email. Please check or sign up.' };
    }

    if (matched.passwordHash !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const appUser: User = {
      id: matched.id,
      email: matched.email,
      full_name: matched.full_name,
      avatar_url: matched.avatar_url,
      created_at: matched.created_at,
    };

    setUser(appUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(appUser));
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              avatar_url: '/src/assets/images/avatar_user_profile_1793946784815.jpg',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const appUser: User = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: cleanName,
            avatar_url: '/src/assets/images/avatar_user_profile_1793946784815.jpg',
            created_at: new Date().toISOString(),
          };
          setUser(appUser);
          localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(appUser));
          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Registration error' };
      }
    }

    // Local authentication engine
    const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: Array<User & { passwordHash: string }> = usersJson ? JSON.parse(usersJson) : [];

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUserId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const newUserRecord: User & { passwordHash: string } = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      avatar_url: '/src/assets/images/avatar_user_profile_1793946784815.jpg',
      created_at: new Date().toISOString(),
      passwordHash: cleanPassword,
    };

    users.push(newUserRecord);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));

    const appUser: User = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      avatar_url: '/src/assets/images/avatar_user_profile_1793946784815.jpg',
      created_at: newUserRecord.created_at,
    };

    setUser(appUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(appUser));
    return { success: true };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    startTransition(() => {
      setUser(null);
    });
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: `Password reset instructions sent to ${cleanEmail}. Check your inbox!`,
        };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Failed to send reset link.' };
      }
    }

    // Local mode simulation
    return {
      success: true,
      message: `Password recovery instructions have been prepared for ${cleanEmail}. In local mode, you can sign in directly or register a new session.`,
    };
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Update in users registry
    const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (usersJson) {
      const users: Array<User & { passwordHash?: string }> = JSON.parse(usersJson);
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      }
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.full_name,
            avatar_url: updatedUser.avatar_url,
          },
        });
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }

    return { success: true };
  };

  const quickDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-user-taskflow-1',
      email: 'alex.rivera@taskflow.dev',
      full_name: 'Alex Rivera',
      avatar_url: '/src/assets/images/avatar_user_profile_1793946784815.jpg',
      created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        quickDemoLogin,
        isLiveSupabase,
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
