import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      await login(username, password);
    } catch (err) {
      setError(err.error || 'Ошибка входа');
    }
  };

  return (
    <View style={styles.container}>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        loading={loading}
        style={styles.button}
      >
        Войти
      </Button>
      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Register')}
      >
        Регистрация
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen; 