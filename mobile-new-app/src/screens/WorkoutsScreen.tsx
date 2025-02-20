import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { WorkoutCard } from '../components/workouts/WorkoutCard';
import { workoutsApi } from '../services/api';
import { Workout } from '../types';

export const WorkoutsScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutsApi.getAll();
      setWorkouts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load workouts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleDelete = async (workout: Workout) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutsApi.delete(workout.id);
              loadWorkouts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (workout: Workout) => {
    // TODO: Навигация к экрану редактирования
    Alert.alert('Edit', 'Edit functionality will be implemented soon');
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onDelete={() => handleDelete(item)}
            onEdit={() => handleEdit(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
      />
      <View style={styles.fab}>
        <Button
          title="Add Workout"
          onPress={() => {
            // TODO: Навигация к экрану создания
            Alert.alert('Add', 'Add functionality will be implemented soon');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 28,
    overflow: 'hidden',
  },
}); 