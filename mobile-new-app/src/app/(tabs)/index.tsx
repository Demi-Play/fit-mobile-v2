import { View, ScrollView, StyleSheet, Appearance } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import React, { useState, useCallback, useEffect } from 'react';
import { workoutsApi, nutritionApi, goalsApi } from '../../../src/services/api';

export default function TabsIndexScreen() {
  const { user, theme } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Состояние для темной темы
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workouts: {
      total: 0,
      caloriesBurned: 0,
      lastWorkout: null as string | null,
    },
    nutrition: {
      todayCalories: 0,
      todayProtein: 0,
      todayCarbs: 0,
      todayFats: 0,
    },
    goals: {
      total: 0,
      achieved: 0,
      inProgress: 0,
    },
  });

  // Определение времени суток и установка приветствия и темы
  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting = '';
    let darkMode = false;

    if (currentHour >= 5 && currentHour < 12) {
      newGreeting = 'Доброе утро';
    } else if (currentHour >= 12 && currentHour < 17) {
      newGreeting = 'Добрый день';
    } else if (currentHour >= 17 && currentHour < 22) {
      newGreeting = 'Добрый вечер';
    } else {
      newGreeting = 'Доброй ночи';
      darkMode = true; // Включаем темную тему ночью
    }

    setGreeting(newGreeting);
    setIsDarkMode(darkMode); // Устанавливаем состояние темной темы
  }, []);

  // Получаем тему на основе состояния темной темы
  const appliedTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);

      // Загрузка статистики тренировок
      const workoutsResponse = await workoutsApi.getAll();
      const workouts = workoutsResponse.data || [];
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
      const lastWorkout = workouts.length > 0 ? workouts[0].date : null;

      // Загрузка статистики питания
      const nutritionResponse = await nutritionApi.getTodayStats();
      console.log('Today nutrition stats:', nutritionResponse.data);

      const todayStats = {
        calories: nutritionResponse.data.total_calories || 0,
        protein: nutritionResponse.data.total_protein || 0,
        carbs: nutritionResponse.data.total_carbohydrates || 0,
        fats: nutritionResponse.data.total_fats || 0,
      };

      // Загрузка статистики целей
      const goalsResponse = await goalsApi.getAll();
      const goals = goalsResponse.data || [];
      const achievedGoals = goals.filter(g => g.achieved).length;

      setStats({
        workouts: {
          total: workouts.length,
          caloriesBurned: totalCalories,
          lastWorkout,
        },
        nutrition: {
          todayCalories: todayStats.calories,
          todayProtein: todayStats.protein,
          todayCarbs: todayStats.carbs,
          todayFats: todayStats.fats,
        },
        goals: {
          total: goals.length,
          achieved: achievedGoals,
          inProgress: goals.length - achievedGoals,
        },
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновляем статистику при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const renderStats = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appliedTheme.colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Ваша статистика</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Всего тренировок</Text>
            <Text style={styles.statValue}>{stats.workouts.total}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Сожжено калорий</Text>
            <Text style={styles.statValue}>{stats.workouts.caloriesBurned}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Калории сегодня</Text>
            <Text style={styles.statValue}>{stats.nutrition.todayCalories}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Белки / Углеводы / Жиры</Text>
            <Text style={styles.statValue}>
              {stats.nutrition.todayProtein}г / {stats.nutrition.todayCarbs}г / {stats.nutrition.todayFats}г
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Достигнуто целей</Text>
            <Text style={styles.statValue}>{stats.goals.achieved} из {stats.goals.total}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>В процессе</Text>
            <Text style={styles.statValue}>{stats.goals.inProgress}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor: appliedTheme.colors.background }}>
      <ScrollView>
        <View style={{ ...styles.header, backgroundColor: appliedTheme.colors.primary }}>
          <Text style={styles.greeting}>{greeting}, {user?.username || 'Гость'}!</Text>
          <Text style={styles.subtitle}>Давайте достигать целей вместе</Text>
        </View>

        {renderStats()}

        <View style={styles.cardsContainer}>
          <Card style={{ ...styles.card, backgroundColor: appliedTheme.colors.surface }}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="fitness" size={24} color={appliedTheme.colors.primary} />
                <Text style={{ ...styles.cardTitle, color: appliedTheme.colors.text }}>Тренировки</Text>
              </View>
              <Text style={{ ...styles.cardText, color: appliedTheme.colors.secondary }}>
                Отслеживайте свои тренировки и прогресс в достижении спортивных целей
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/(tabs)/workouts" asChild>
                <Button mode="contained">Перейти к тренировкам</Button>
              </Link>
            </Card.Actions>
          </Card>

          <Card style={{ ...styles.card, backgroundColor: appliedTheme.colors.surface }}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="restaurant" size={24} color={appliedTheme.colors.primary} />
                <Text style={{ ...styles.cardTitle, color: appliedTheme.colors.text }}>Питание</Text>
              </View>
              <Text style={{ ...styles.cardText, color: appliedTheme.colors.secondary }}>
                Контролируйте свой рацион и следите за потреблением калорий
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/(tabs)/nutrition" asChild>
                <Button mode="contained">Управление питанием</Button>
              </Link>
            </Card.Actions>
          </Card>

          <Card style={{ ...styles.card, backgroundColor: appliedTheme.colors.surface }}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="trophy" size={24} color={appliedTheme.colors.primary} />
                <Text style={{ ...styles.cardTitle, color: appliedTheme.colors.text }}>Цели</Text>
              </View>
              <Text style={{ ...styles.cardText, color: appliedTheme.colors.secondary }}>
                Ставьте цели и отслеживайте их достижение
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/(tabs)/goals" asChild>
                <Button mode="contained">Мои цели</Button>
              </Link>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
});
