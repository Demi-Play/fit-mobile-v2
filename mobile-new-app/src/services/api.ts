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
  getAll: () => {
    console.log('Fetching all workouts');
    return api.get<Workout[]>('/workouts/');
  },
  getById: (id: number) => {
    console.log(`Fetching workout with id ${id}`);
    return api.get<Workout>(`/workouts/${id}/`);
  },
  create: (data: Partial<Workout>) => {
    console.log('Creating new workout:', data);
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.post<Workout>('/workouts/', formattedData);
  },
  update: (id: number, data: Partial<Workout>) => {
    console.log(`Updating workout ${id}:`, data);
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.put<Workout>(`/workouts/${id}/`, formattedData);
  },
  delete: (id: number) => {
    console.log(`Deleting workout ${id}`);
    return api.delete(`/workouts/${id}/`);
  },
  deleteAll: () => {
    console.log('Deleting all workouts');
    return api.delete('/workouts/delete_all/');
  },
  deleteByDate: (date: string) => {
    console.log(`Deleting workouts for date ${date}`);
    return api.delete(`/workouts/delete_by_date/?date=${date}`);
  }
};

// Nutrition API
export const nutritionApi = {
  getAll: () => {
    console.log('Fetching all nutrition records');
    return api.get<Nutrition[]>('/nutrition/');
  },
  getById: (id: number) => {
    console.log(`Fetching nutrition record with id ${id}`);
    return api.get<Nutrition>(`/nutrition/${id}/`);
  },
  create: (data: Partial<Nutrition>) => {
    console.log('Creating new nutrition record:', data);
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.post<Nutrition>('/nutrition/', formattedData);
  },
  update: (id: number, data: Partial<Nutrition>) => {
    console.log(`Updating nutrition record ${id}:`, data);
    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : undefined
    };
    return api.put<Nutrition>(`/nutrition/${id}/`, formattedData);
  },
  delete: (id: number) => {
    console.log(`Deleting nutrition record ${id}`);
    return api.delete(`/nutrition/${id}/`);
  },
  deleteAll: () => {
    console.log('Deleting all nutrition records');
    return api.delete('/nutrition/delete_all/');
  },
  deleteByDate: (date: string) => {
    console.log(`Deleting nutrition records for date ${date}`);
    return api.delete(`/nutrition/delete_by_date/?date=${date}`);
  },
  deleteByMealType: (mealType: string) => {
    console.log(`Deleting nutrition records for meal type ${mealType}`);
    return api.delete(`/nutrition/delete_by_meal_type/?meal_type=${mealType}`);
  }
};

// Goals API
export const goalsApi = {
  getAll: () => {
    console.log('Fetching all goals');
    return api.get<Goal[]>('/goals/');
  },
  getById: (id: number) => {
    console.log(`Fetching goal with id ${id}`);
    return api.get<Goal>(`/goals/${id}/`);
  },
  create: (data: Partial<Goal>) => {
    console.log('Creating new goal:', data);
    const formattedData = {
      ...data,
      target_date: data.target_date ? new Date(data.target_date).toISOString() : undefined
    };
    return api.post<Goal>('/goals/', formattedData);
  },
  update: (id: number, data: Partial<Goal>) => {
    console.log(`Updating goal ${id}:`, data);
    const formattedData = {
      ...data,
      target_date: data.target_date ? new Date(data.target_date).toISOString() : undefined
    };
    return api.put<Goal>(`/goals/${id}/`, formattedData);
  },
  delete: (id: number) => {
    console.log(`Deleting goal ${id}`);
    return api.delete(`/goals/${id}/`);
  },
  updateProgress: (id: number, progress: number) => {
    console.log(`Updating goal ${id} progress to ${progress}`);
    return api.patch<Goal>(`/goals/${id}/`, { progress });
  },
  toggleAchieved: (id: number, achieved: boolean) => {
    console.log(`Setting goal ${id} achieved status to ${achieved}`);
    return api.patch<Goal>(`/goals/${id}/`, { achieved });
  }
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