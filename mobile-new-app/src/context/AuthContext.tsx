import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { logger } from '../utils/logger';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      logger.info('Attempting login', { username });
      const response = await api.post('/auth/login/', { username, password });
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response data');
      }
      
      setUser(response.data);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      logger.info('Login successful', { username: response.data.username });
    } catch (error) {
      logger.error('Login failed:', error);
      await AsyncStorage.removeItem('user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
      setUser(null);
      await AsyncStorage.removeItem('user');
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      logger.info('Attempting registration', { username, email });
      const response = await api.post('/auth/register/', { 
        username, 
        email, 
        password 
      });
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response data');
      }
      
      setUser(response.data);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      logger.info('Registration successful', { username });
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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