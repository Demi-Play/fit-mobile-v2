import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Portal, Modal, TextInput, Button, SegmentedButtons, IconButton } from 'react-native-paper';
import { Goal } from '../../../src/types';
import { goalsApi } from '../../../src/services/api';
import { logger } from '../../../src/utils/logger';
import { GoalCard } from '../../../src/components/goals/GoalCard';
import { FAB } from 'react-native-paper';
import { useAuth } from '../../../src/context/AuthContext';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export default function GoalsScreen() {
  const { theme } = useAuth();
  const appliedTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    category: 'weight',
    goal_type: 'weight_loss',
    target_weight: '',
    target_date: new Date().toISOString().split('T')[0],
    progress: 0,
    achieved: false,
  });

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setEditingGoal(null);
    setNewGoal({
      name: '',
      description: '',
      category: 'weight',
      goal_type: 'weight_loss',
      target_weight: '',
      target_date: new Date().toISOString().split('T')[0],
      progress: 0,
      achieved: false,
    });
  };

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsApi.getAll();
      setGoals(response.data || []);
    } catch (error) {
      logger.error('Error loading goals:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить цели');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (goalId: number) => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите удалить эту цель?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalsApi.delete(goalId);
              await loadGoals();
            } catch (error) {
              logger.error('Error deleting goal:', error);
              Alert.alert('Ошибка', 'Не удалось удалить цель');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      description: goal.description,
      category: goal.category,
      goal_type: goal.goal_type,
      target_weight: goal.target_weight.toString(),
      target_date: goal.target_date,
      progress: goal.progress,
      achieved: goal.achieved,
    });
    showModal();
  };

  const handleSave = async () => {
    try {
      if (editingGoal) {
        await goalsApi.update(editingGoal.id, {
          ...newGoal,
          target_weight: newGoal.target_weight.toString(),
          category: newGoal.category as Goal['category'],
          goal_type: newGoal.goal_type as Goal['goal_type'],
        });
      } else {
        await goalsApi.create({
          ...newGoal,
          target_weight: newGoal.target_weight.toString(),
          category: newGoal.category as Goal['category'],
          goal_type: newGoal.goal_type as Goal['goal_type'],
        });
      }
      await loadGoals();
      hideModal();
    } catch (error) {
      logger.error('Error saving goal:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить цель');
    }
  };

  const handleToggleAchieved = async (goalId: number, achieved: boolean) => {
    try {
      await goalsApi.toggleAchieved(goalId, !achieved);
      await loadGoals();
    } catch (error) {
      logger.error('Error toggling goal achievement:', error);
      Alert.alert('Ошибка', 'Не удалось обновить статус цели');
    }
  };

  const handleUpdateProgress = async (goalId: number, progress: number) => {
    try {
      await goalsApi.updateProgress(goalId, progress);
      await loadGoals();
    } catch (error) {
      logger.error('Error updating goal progress:', error);
      Alert.alert('Ошибка', 'Не удалось обновить прогресс');
    }
  };

  const getGoalTypeLabel = (type: Goal['goal_type']) => {
    const labels = {
      weight_loss: 'Снижение веса',
      weight_gain: 'Набор веса',
      muscle_gain: 'Набор мышечной массы',
      endurance: 'Выносливость',
      flexibility: 'Гибкость',
      strength: 'Сила',
      weight: 'Вес',
      workout: 'Тренировка',
      nutrition: 'Питание',
      other: 'Другое',
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: Goal['category']) => {
    const labels = {
      weight: 'Вес',
      workout: 'Тренировка',
      nutrition: 'Питание',
      other: 'Другое',
    };
    return labels[category] || category;
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: appliedTheme.colors.background }}>
      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onToggleAchieved={() => handleToggleAchieved(item.id, item.achieved)}
            onUpdateProgress={(progress) => handleUpdateProgress(item.id, item.progress)}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item)}
            getGoalTypeLabel={getGoalTypeLabel}
            getCategoryLabel={getCategoryLabel}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadGoals}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{ ...styles.modalContent, backgroundColor: appliedTheme.colors.surface }}
        >
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.modalTitle}>
              {editingGoal ? 'Редактировать цель' : 'Новая цель'}
            </Text>
            <TextInput
              label="Название"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Описание"
              value={newGoal.description}
              onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
              style={styles.input}
              multiline
            />
            <TextInput
              label="Целевой вес (кг)"
              value={newGoal.target_weight}
              onChangeText={(text) => setNewGoal({ ...newGoal, target_weight: text })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Дата достижения"
              value={newGoal.target_date}
              onChangeText={(text) => setNewGoal({ ...newGoal, target_date: text })}
              style={styles.input}
            />
            <Text>Текущий прогресс в процентах</Text>
            <SegmentedButtons
              value={newGoal.progress}
              onValueChange={(value: number) =>
                setNewGoal({ ...newGoal, progress: value as Goal['progress'] })
              }
              buttons={[
                { value: 0, label: 0 },
                { value: 25, label: 25 },
                { value: 50, label: 50 },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={newGoal.progress}
              onValueChange={(value: number) =>
                setNewGoal({ ...newGoal, progress: value as Goal['progress'] })
              }
              buttons={[
                { value: 65, label: 65 },
                { value: 85, label: 85 },
                { value: 100, label: 100 },
              ]}
              style={styles.segmentedButtons}
            />
            <Text>Тип цели</Text>
            <SegmentedButtons
              value={newGoal.goal_type}
              onValueChange={(value: string) =>
                setNewGoal({ ...newGoal, goal_type: value as Goal['goal_type'] })
              }
              buttons={[
                { value: 'weight', label: 'Вес' },
                { value: 'workout', label: 'Тренировка' },
                { value: 'nutrition', label: 'Питание' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={newGoal.goal_type}
              onValueChange={(value: string) =>
                setNewGoal({ ...newGoal, goal_type: value as Goal['goal_type'] })
              }
              buttons={[
                { value: 'weight_loss', label: 'Снижение веса' },
                { value: 'muscle_gain', label: 'Набор массы' },
                { value: 'endurance', label: 'Выносливость' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={newGoal.goal_type}
              onValueChange={(value: string) =>
                setNewGoal({ ...newGoal, goal_type: value as Goal['goal_type'] })
              }
              buttons={[
                { value: 'flexibility', label: 'Гибкость' },
                { value: 'strength', label: 'Сила' },
                { value: 'other', label: 'Другое' },
              ]}
              style={styles.segmentedButtons}
            />
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              {editingGoal ? 'Сохранить' : 'Добавить'}
            </Button>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB icon="plus" style={styles.fab} onPress={showModal} />
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
    maxHeight: '80%',
  },
  input: {
    marginBottom: 12, 
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 20,
  },
  modalScrollView: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
}); 