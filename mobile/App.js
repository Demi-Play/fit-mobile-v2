import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Создаем кастомную тему
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#f1c40f',
    background: '#f5f5f5',
  },
};

// Основной компонент приложения
function MainApp() {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <PaperProvider theme={theme}>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}
