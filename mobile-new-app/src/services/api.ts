import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Nutrition, Goal } from '../types';
import { Platform } from 'react-native';

// Для Android эмулятора используем 10.0.2.2 вместо localhost
// Для iOS эмулятора используем localhost
// Для реального устройства используем IP адрес компьютера
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  ios: 'http://localhost:8000/api',
  default: 'http://10.0.2.2:8000/api',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Добавляем таймаут в 10 секунд
});

// Request interceptor with logging
api.interceptors.request.use(async (config) => {
  console.log('Request URL:', `${config.baseURL}${config.url}`);
  console.log('Request Method:', config.method);
  console.log('Request Headers:', config.headers);
  
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('JWT token found:', token);
  } else {
    console.log('No JWT token found in AsyncStorage');
  }
  
  if (config.data) {
    console.log('Request Data:', config.data);
  }
  
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor with logging
api.interceptors.response.use(
  (response) => {
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);

    // Если получаем 401, пробуем обновить токен
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          await AsyncStorage.setItem('access_token', access);
          
          // Повторяем исходный запрос с новым токеном
          error.config.headers.Authorization = `Bearer ${access}`;
          return api(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Если не удалось обновить токен, очищаем хранилище
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
    return response;
  },
  logout: async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    return api.post('/auth/logout/');
  },
  register: (userData: any) => 
    api.post('/auth/register/', userData),
};

// Workouts API
export const workoutsApi = {
  getAll: () => api.get<Workout[]>('/workouts/'),
  getById: (id: number) => api.get<Workout>(`/workouts/${id}/`),
  create: (data: Partial<Workout>) => api.post<Workout>('/workouts/', data),
  update: (id: number, data: Partial<Workout>) => api.put<Workout>(`/workouts/${id}/`, data),
  delete: (id: number) => api.delete(`/workouts/${id}/`),
};

// Nutrition API
export const nutritionApi = {
  getAll: () => api.get<Nutrition[]>('/nutrition/'),
  getById: (id: number) => api.get<Nutrition>(`/nutrition/${id}/`),
  create: (data: Partial<Nutrition>) => {
    // Преобразуем дату в нужный формат, если она есть
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.post<Nutrition>('/nutrition/', formattedData);
  },
  update: (id: number, data: Partial<Nutrition>) => {
    // Преобразуем дату в нужный формат, если она есть
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.put<Nutrition>(`/nutrition/${id}/`, formattedData);
  },
  delete: (id: number) => api.delete(`/nutrition/${id}/`),
};

// Goals API
export const goalsApi = {
  getAll: () => api.get<Goal[]>('/goals/'),
  getById: (id: number) => api.get<Goal>(`/goals/${id}/`),
  create: (data: Partial<Goal>) => api.post<Goal>('/goals/', data),
  update: (id: number, data: Partial<Goal>) => api.put<Goal>(`/goals/${id}/`, data),
  delete: (id: number) => api.delete(`/goals/${id}/`),
};

export default api;

// Тестирование запросов
const testApi = async () => {
  try {
    const workoutsResponse = await workoutsApi.getAll();
    console.log('Workouts response:', workoutsResponse.data);
    
    const nutritionResponse = await nutritionApi.getAll();
    console.log('Nutrition response:', nutritionResponse.data);
    
    const goalsResponse = await goalsApi.getAll();
    console.log('Goals response:', goalsResponse.data);
  } catch (error) {
    console.error('API Test Error:', error);
  }
}; 