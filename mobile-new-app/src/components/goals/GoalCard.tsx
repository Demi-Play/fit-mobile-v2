import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Goal } from '../../types';

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
          {goal.category}
        </Text>
      </View>
      
      <Text style={styles.description}>{goal.description}</Text>
      
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

      <Text style={styles.date}>
        Target: {new Date(goal.target_date).toLocaleDateString()}
      </Text>

      <View style={styles.actions}>
        <Button
          title={goal.achieved ? "Mark Incomplete" : "Mark Complete"}
          onPress={onToggleAchieved}
          variant={goal.achieved ? "secondary" : "primary"}
        />
        <Button
          title="Edit"
          onPress={onEdit}
          variant="secondary"
        />
        <Button
          title="Delete"
          onPress={onDelete}
          variant="danger"
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
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
}); 