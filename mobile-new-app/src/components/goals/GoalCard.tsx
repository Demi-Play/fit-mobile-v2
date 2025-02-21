import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Goal } from '../../types';
import { FAB } from 'react-native-paper';

interface GoalCardProps {
  goal: Goal;
  onToggleAchieved: () => void;
  onUpdateProgress: (progress: number) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggleAchieved,
  onUpdateProgress,
  onDelete,
  onEdit,
}) => {
  const progressColor = goal.progress < 50 ? '#FF3B30' : goal.progress < 80 ? '#FFCC00' : '#34C759';

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{goal.name}</Text>
        <Text style={[styles.category, styles[`category_${goal.category}`]]}>
          {goal.goal_type}
        </Text>
      </View>
      
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${goal.progress}%`, backgroundColor: progressColor }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{`${goal.target_weight} кг`}</Text>
      </View>

      <Text style={styles.date}>
        Дедлайн: {new Date(goal.target_date).toLocaleDateString()}
      </Text>

      <View style={styles.actions}>
        <Button
          title={goal.achieved ? "Не выполнено" : "Выполнено"}
          onPress={onToggleAchieved}
          variant={goal.achieved ? "secondary" : "primary"}
        />
        
        <FAB
        icon="pencil"
        style={styles.edit}
        variant="secondary"
        onPress={onEdit}
      />
      <FAB
        icon="delete"
        style={styles.delete}
        variant="danger"
        onPress={onDelete}
      />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  category: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '500',
  },
  category_workout: {
    backgroundColor: '#5856D6',
    color: '#FFFFFF',
  },
  category_nutrition: {
    backgroundColor: '#34C759',
    color: '#FFFFFF',
  },
  category_weight: {
    backgroundColor: '#FF9500',
    color: '#FFFFFF',
  },
  category_other: {
    backgroundColor: '#8E8E93',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E9E9E9',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    width: 45,
    textAlign: 'right',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  delete: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
  },
  edit: {
    position: 'absolute',
    right: 70,
    bottom: 0,
  },
}); 