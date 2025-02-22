import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Goal } from '../../types';
import { IconButton } from 'react-native-paper';

interface GoalCardProps {
  goal: Goal;
  onToggleAchieved: () => void;
  onUpdateProgress: (progress: number) => void;
  onDelete: () => void;
  onEdit: () => void;
  getGoalTypeLabel: (type: Goal['goal_type']) => string;
  getCategoryLabel: (category: Goal['category']) => string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggleAchieved,
  onUpdateProgress,
  onDelete,
  onEdit,
  getGoalTypeLabel,
  getCategoryLabel
}) => {
  const progressColor = goal.progress < 50 ? '#FF3B30' : goal.progress < 80 ? '#FFCC00' : '#34C759';

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.category}>{getCategoryLabel(goal.name)}</Text>
          <Text style={styles.title}>{getCategoryLabel(goal.description)}</Text>
          <Text style={styles.goalType}>{getGoalTypeLabel(goal.goal_type)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={onEdit}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={onDelete}
          />
        </View>
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
        <Text style={styles.progressText}>{`${goal.progress}%`}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.weightText}>Целевой вес: {goal.target_weight} кг</Text>
        <Text style={styles.dateText}>
          Дедлайн: {new Date(goal.target_date).toLocaleDateString()}
        </Text>
      </View>

      <Button
        title={goal.achieved ? "Отменить" : "Выполнено"}
        onPress={onToggleAchieved}
        variant={goal.achieved ? "secondary" : "primary"}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007AFF',
  },
  goalType: {
    fontSize: 16,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
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
  infoContainer: {
    marginBottom: 12,
  },
  weightText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
}); 