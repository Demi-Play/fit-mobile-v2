import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, FAB, Portal, Modal, TextInput, Button, IconButton } from 'react-native-paper';
import { Workout } from '../../../src/types';
import { workoutsApi } from '../../../src/services/api';
import { logger } from '../../../src/utils/logger';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
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

  const handleDelete = (workout: Workout) => {
    Alert.alert(
      "Удаление тренировки",
      "Вы уверены, что хотите удалить эту тренировку?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await workoutsApi.delete(workout.id);
              loadWorkouts();
            } catch (error) {
              logger.error('Error deleting workout:', error);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name || '',
      description: workout.description || '',
      duration: workout.duration?.toString() || '',
      calories_burned: workout.calories_burned?.toString() || '',
      date: workout.date
    });
    setVisible(true);
  };

  const handleSave = async () => {
    try {
      const workoutData = {
        ...newWorkout,
        duration: parseInt(newWorkout.duration) || 0,
        calories_burned: parseInt(newWorkout.calories_burned) || 0
      };

      if (editingWorkout) {
        await workoutsApi.update(editingWorkout.id, workoutData);
      } else {
        await workoutsApi.create(workoutData);
      }

      setVisible(false);
      setEditingWorkout(null);
      setNewWorkout({
        name: '',
        description: '',
        duration: '',
        calories_burned: '',
        date: new Date().toISOString()
      });
      loadWorkouts();
    } catch (error) {
      logger.error('Error saving workout:', error);
    }
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutItem}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name || 'Без названия'}</Text>
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEdit(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
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
        onPress={() => {
          setEditingWorkout(null);
          setNewWorkout({
            name: '',
            description: '',
            duration: '',
            calories_burned: '',
            date: new Date().toISOString()
          });
          setVisible(true);
        }}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisible(false);
            setEditingWorkout(null);
          }}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingWorkout ? 'Редактировать тренировку' : 'Новая тренировка'}
          </Text>
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
            onPress={handleSave}
            style={styles.button}
          >
            {editingWorkout ? 'Сохранить' : 'Добавить'}
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
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
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