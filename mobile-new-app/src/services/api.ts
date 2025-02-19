import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Nutrition, Goal } from '../types';

const BASE_URL = 'http://your-api-url.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(async (config) => {
  const user = await AsyncStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    config.headers.Authorization = `Token ${userData.token}`;
  }
  return config;
});

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
  create: (data: Partial<Nutrition>) => api.post<Nutrition>('/nutrition/', data),
  update: (id: number, data: Partial<Nutrition>) => api.put<Nutrition>(`/nutrition/${id}/`, data),
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