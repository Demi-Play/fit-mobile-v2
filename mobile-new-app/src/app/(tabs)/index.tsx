import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { workoutsApi, nutritionApi, goalsApi } from '../../../src/services/api';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Загрузка статистики тренировок
        const workoutsResponse = await workoutsApi.getAll();
        const workouts = workoutsResponse.data || [];
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
        const lastWorkout = workouts.length > 0 ? workouts[0].date : null;

        // Загрузка статистики питания
        const nutritionResponse = await nutritionApi.getAll();
        const todayNutrition = (nutritionResponse.data || []).filter(n => 
          new Date(n.date || '').toDateString() === new Date().toDateString()
        );
        const todayStats = todayNutrition.reduce((acc, n) => ({
          calories: acc.calories + (n.calories || 0),
          protein: acc.protein + (n.protein || 0),
          carbs: acc.carbs + (n.carbohydrates || 0),
          fats: acc.fats + (n.fats || 0),
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

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
    };

    loadStats();
  }, []);

  const renderStats = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Привет, {user?.username || 'Гость'}!</Text>
        <Text style={styles.subtitle}>Давайте достигать целей вместе</Text>
      </View>

      {renderStats()}

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Ionicons name="fitness" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Тренировки</Text>
            </View>
            <Text style={styles.cardText}>
              Отслеживайте свои тренировки и прогресс в достижении спортивных целей
            </Text>
          </Card.Content>
          <Card.Actions>
            <Link href="/(tabs)/workouts" asChild>
              <Button mode="contained">Перейти к тренировкам</Button>
            </Link>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Питание</Text>
            </View>
            <Text style={styles.cardText}>
              Контролируйте свой рацион и следите за потреблением калорий
            </Text>
          </Card.Content>
          <Card.Actions>
            <Link href="/(tabs)/nutrition" asChild>
              <Button mode="contained">Управление питанием</Button>
            </Link>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Цели</Text>
            </View>
            <Text style={styles.cardText}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
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