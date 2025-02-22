import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
import { logger } from '../utils/logger';
import { router } from 'expo-router';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const updateUser = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      logger.info('Attempting login', { username });
      const response = await authApi.login(username, password);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response data');
      }
      
      const { user } = response.data;
      
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
      await authApi.logout();
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
      logger.info('Logout successful');
      
      // Перенаправляем на страницу входа
      router.replace('/login');
    } catch (error) {
      logger.error('Logout failed:', error);
      // В любом случае очищаем локальные данные и состояние пользователя
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);
      // Даже при ошибке перенаправляем на страницу входа
      router.replace('/login');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      logger.info('Attempting registration', { username, email });
      const response = await authApi.register({ username, email, password });
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response data');
      }
      
      const { user } = response.data;
      
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
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
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