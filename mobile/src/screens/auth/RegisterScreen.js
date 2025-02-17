import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    try {
      setError('');
      await register({ username, email, password });
    } catch (err) {
      setError(err.error || 'Ошибка регистрации');
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
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        onPress={handleRegister} 
        loading={loading}
        style={styles.button}
      >
        Зарегистрироваться
      </Button>
      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Login')}
      >
        Уже есть аккаунт? Войти
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

export default RegisterScreen; 