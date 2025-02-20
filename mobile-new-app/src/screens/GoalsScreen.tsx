import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { GoalCard } from '../components/goals/GoalCard';
import { goalsApi } from '../services/api';
import { Goal } from '../types';

export const GoalsScreen = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsApi.getAll();
      setGoals(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load goals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleToggleAchieved = async (goal: Goal) => {
    try {
      await goalsApi.toggleAchieved(goal.id, !goal.achieved);
      loadGoals(); // Перезагружаем список
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal status');
      console.error(error);
    }
  };

  const handleUpdateProgress = async (goal: Goal, progress: number) => {
    try {
      await goalsApi.updateProgress(goal.id, progress);
      loadGoals(); // Перезагружаем список
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal progress');
      console.error(error);
    }
  };

  const handleDelete = async (goal: Goal) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalsApi.delete(goal.id);
              loadGoals(); // Перезагружаем список
            } catch (error) {
              Alert.alert('Error', 'Failed to delete goal');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (goal: Goal) => {
    // TODO: Навигация к экрану редактирования
    Alert.alert('Edit', 'Edit functionality will be implemented soon');
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onToggleAchieved={() => handleToggleAchieved(item)}
            onUpdateProgress={(progress) => handleUpdateProgress(item, progress)}
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
          title="Add Goal"
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