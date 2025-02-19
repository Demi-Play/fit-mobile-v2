import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../../src/utils/api';

interface Workout {
  id: number;
  name: string;
  description: string;
  duration: number;
  calories_burned: number;
}

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [visible, setVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    duration: '',
    calories_burned: ''
  });
  const router = useRouter();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const response = await api.get('/workouts/');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const handleAddWorkout = async () => {
    try {
      await api.post('/workouts/', {
        ...newWorkout,
        duration: parseInt(newWorkout.duration),
        calories_burned: parseInt(newWorkout.calories_burned)
      });
      setVisible(false);
      setNewWorkout({ name: '', description: '', duration: '', calories_burned: '' });
      loadWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Тренировки</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
  input: {
    marginBottom: 12,
  },
}); 