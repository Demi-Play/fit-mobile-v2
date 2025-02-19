import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { user } = useAuth();

  // Если пользователь авторизован, перенаправляем на главный экран
  // Если нет - на страницу входа
  return <Redirect href={user ? "/(tabs)" : "/(auth)/login"} />;
} 