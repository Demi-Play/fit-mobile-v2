import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Привет, {user?.username || 'Гость'}!</Text>
        <Text style={styles.subtitle}>Давайте достигать целей вместе</Text>
      </View>

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