import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter, Link } from 'expo-router';
import { logger } from '../../../src/utils/logger';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
      setError('');
      await login(username, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.message ||
                          'Ошибка входа';
      setError(errorMessage);
      logger.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Title style={styles.title}>Вход</Title>
      
      <TextInput
        label="Имя пользователя"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        loading={loading}
        style={styles.button}
      >
        Войти
      </Button>

      <Link href="/(auth)/register" asChild>
        <Button mode="text" style={styles.linkButton}>
          Нет аккаунта? Зарегистрироваться
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
  },
  linkButton: {
    marginTop: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 