import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserSettings, StreakInfo } from '../types';
import { api, getAuthToken, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  settings: UserSettings | null;
  streak: StreakInfo | null;
  achievements: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  loginWithGoogle: (googleData?: { email?: string; name?: string; avatar?: string; googleId?: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  updateUserSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMe = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setSettings(null);
      setStreak(null);
      setAchievements([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setSettings(data.settings);
      setStreak(data.streak);
      setAchievements(data.achievements || []);
    } catch (err) {
      console.error('Session expired or error fetching me:', err);
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (credentials: { login: string; password: string }) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    await refreshMe();
  };

  const loginWithGoogle = async (googleData?: { email?: string; name?: string; avatar?: string; googleId?: string }) => {
    if (!googleData?.email) {
      throw new Error('Google authentication data is required.');
    }
    const res = await api.googleAuth(googleData);
    setAuthToken(res.token);
    await refreshMe();
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setAuthToken(res.token);
    setUser(res.user);
    await refreshMe();
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setSettings(null);
    setStreak(null);
    setAchievements([]);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    const res = await api.updateSettings(newSettings);
    setSettings(res.settings);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        streak,
        achievements,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        updateUserSettings,
        refreshMe
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
