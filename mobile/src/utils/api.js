import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8000/api';  // для Android эмулятора
// const BASE_URL = 'http://localhost:8000/api';  // для iOS симулятора

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
  async (config) => {
    const session = await AsyncStorage.getItem('session');
    if (session) {
      config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;