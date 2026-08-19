import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  branch: string;
}

// Normalize backend user object (handles _id vs id, missing fields, etc.)
const normalizeUser = (raw: any): User => ({
  id: raw.id || raw._id || '',
  fullName: raw.fullName || raw.name || '',
  email: raw.email || '',
  role: raw.role || 'member',
  branch: raw.branch || '',
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: string, branch?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(normalizeUser(JSON.parse(storedUser)));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: rawUser } = response.data;

      const newUser = normalizeUser({ ...rawUser, email: rawUser?.email || email });

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  };

  const register = async (fullName: string, email: string, password: string, role: string, branch?: string) => {
    try {
      const response = await authAPI.register({ fullName, email, password, role, branch });
      const { token: newToken } = response.data;

      await AsyncStorage.setItem('token', newToken);

      // After registration, login to get full user data
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
