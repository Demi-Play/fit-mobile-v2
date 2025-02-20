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
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response data');
      }
      
      const { user, access, refresh } = response.data;
      
      // Сохраняем токены
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      
      // Сохраняем данные пользователя
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      logger.info('Login successful', { username: user.username });
    } catch (error) {
      logger.error('Login failed:', error);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      await api.post('/auth/logout/', { refresh: refreshToken });
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed:', error);
      // Даже если запрос не удался, очищаем локальные данные
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
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
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response data');
      }
      
      const { user, access, refresh } = response.data;
      
      // Сохраняем токены
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      
      // Сохраняем данные пользователя
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
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