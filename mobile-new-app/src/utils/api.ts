import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Для Android эмулятора используйте 10.0.2.2 вместо localhost
// Для iOS эмулятора используйте localhost
// Для реального устройства используйте IP адрес вашего компьютера в локальной сети
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  ios: 'http://localhost:8000/api',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для установки токена в заголовки
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обновляем пути для аутентификации
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register/', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login/', data), 
  getProfile: () => api.get('/auth/user/'),
};

export default api; 