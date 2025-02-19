import axios from 'axios';
import { Platform } from 'react-native';
import { logger } from './logger';

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
  withCredentials: true, // Важно для работы с сессиями
});

// Добавляем перехватчик для логирования запросов
api.interceptors.request.use(
  async (config) => {
    logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    logger.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api; 