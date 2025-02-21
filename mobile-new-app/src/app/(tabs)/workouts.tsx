import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { Workout } from '../../../src/types';
import { workoutsApi } from '../../../src/services/api';
import { logger } from '../../../src/utils/logger';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    duration: '',
    calories_burned: '',
    date: new Date().toISOString()
  });

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutsApi.getAll();
      setWorkouts(response.data || []);
    } catch (error) {
      logger.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutName}>{item.name || 'Без названия'}</Text>
      <Text>{item.description || 'Без описания'}</Text>
      <Text>Длительность: {item.duration || 0} мин</Text>
      <Text>Калории: {item.calories_burned || 0} ккал</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => `${item.id || Math.random()}`}
        refreshing={loading}
        onRefresh={loadWorkouts}
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Новая тренировка</Text>
          <TextInput
            label="Название"
            value={newWorkout.name}
            onChangeText={(text: string) => setNewWorkout(prev => ({ ...prev, name: text }))}
            style={styles.input}
          />
          <TextInput
            label="Описание"
            value={newWorkout.description}
            onChangeText={(text: string) => setNewWorkout(prev => ({ ...prev, description: text }))}
            style={styles.input}
          />
          <TextInput
            label="Длительность (мин)"
            value={newWorkout.duration}
            onChangeText={(text: string) => setNewWorkout(prev => ({ ...prev, duration: text }))}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Сожжено калорий"
            value={newWorkout.calories_burned}
            onChangeText={(text: string) => setNewWorkout(prev => ({ ...prev, calories_burned: text }))}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={async () => {
              try {
                await workoutsApi.create({
                  ...newWorkout,
                  duration: parseInt(newWorkout.duration) || 0,
                  calories_burned: parseInt(newWorkout.calories_burned) || 0
                });
                setVisible(false);
                setNewWorkout({
                  name: '',
                  description: '',
                  duration: '',
                  calories_burned: '',
                  date: new Date().toISOString()
                });
                loadWorkouts();
              } catch (error) {
                logger.error('Error adding workout:', error);
              }
            }}
            style={styles.button}
          >
            Добавить
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  workoutItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
}); 