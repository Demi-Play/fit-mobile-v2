import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Portal, Modal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Goal } from '../../../src/types';
import { goalsApi } from '../../../src/services/api';
import { logger } from '../../../src/utils/logger';
import { GoalCard } from '../../../src/components/goals/GoalCard';
import { FAB } from 'react-native-paper';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newGoal, setNewGoal] = useState({
    target_date: new Date().toISOString().split('T')[0],
    category: 'workout' as Goal['category'],
    progress: 0,
    goal_type: 'strength',
    target_weight: '0'
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsApi.getAll();
      setGoals(response.data || []);
    } catch (error) {
      logger.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleCreateGoal = async () => {
    try {
      await goalsApi.create(newGoal);
      setVisible(false);
      setNewGoal({
        target_date: new Date().toISOString().split('T')[0],
        category: 'workout',
        progress: 0,
        goal_type: 'strength',
        target_weight: '0'
      });
      loadGoals();
    } catch (error) {
      logger.error('Error creating goal:', error);
    }
  };

  const handleToggleAchieved = async (goal: Goal) => {
    try {
      await goalsApi.toggleAchieved(goal.id, !goal.achieved);
      loadGoals();
    } catch (error) {
      logger.error('Error toggling goal achievement:', error);
    }
  };

  const handleUpdateProgress = async (goal: Goal, progress: number) => {
    try {
      await goalsApi.updateProgress(goal.id, progress);
      loadGoals();
    } catch (error) {
      logger.error('Error updating goal progress:', error);
    }
  };

  const handleDelete = async (goal: Goal) => {
    try {
      await goalsApi.delete(goal.id);
      loadGoals();
    } catch (error) {
      logger.error('Error deleting goal:', error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Новая цель</Text>
          <TextInput
            label="Дата достижения"
            value={newGoal.target_date}
            onChangeText={(text: string) => setNewGoal({ ...newGoal, target_date: text })}
            style={styles.input}
          />
          <SegmentedButtons
            value={newGoal.category}
            onValueChange={(value: string) => 
              setNewGoal({ ...newGoal, category: value as Goal['category'] })
            }
            buttons={[
              { value: 'workout', label: 'Тренировка' },
              { value: 'nutrition', label: 'Питание' },
              { value: 'weight', label: 'Вес' },
              { value: 'other', label: 'Другое' },
            ]}
            style={styles.segmentedButtons}
          />
          <SegmentedButtons
            value={newGoal.goal_type}
            onValueChange={(value: string) => setNewGoal({ ...newGoal, goal_type: value })}
            buttons={[
              { value: 'strength', label: 'Сила' },
              { value: 'endurance', label: 'Выносливость' },
              { value: 'weight_loss', label: 'Снижение веса' },
              { value: 'muscle_gain', label: 'Набор массы' },
            ]}
            style={styles.segmentedButtons}
          />
          <TextInput
            label="Целевой вес (кг)"
            value={newGoal.target_weight}
            onChangeText={(text: string) => setNewGoal({ ...newGoal, target_weight: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button onPress={() => setVisible(false)} style={styles.modalButton}>
              Отмена
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCreateGoal} 
              style={styles.modalButton}
              loading={loading}
            >
              Создать
            </Button>
          </View>
        </Modal>
      </Portal>

      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onToggleAchieved={() => handleToggleAchieved(item)}
            onUpdateProgress={(progress) => handleUpdateProgress(item, progress)}
            onDelete={() => handleDelete(item)}
            onEdit={() => {}} // TODO: Implement edit functionality
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
      />

      {/* <Button
        mode="contained"
        onPress={() => setVisible(true)}
        style={styles.fab}
        icon="plus"
      >
        Добавить цель
      </Button> */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
      />
    </View>
  );
}

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
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    minWidth: 100,
  },
}); 