import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Workout } from '../../types';

interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.duration}>{workout.duration} min</Text>
      </View>

      <Text style={styles.description}>{workout.description}</Text>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{workout.calories_burned}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
      </View>

      <Text style={styles.date}>
        {new Date(workout.date).toLocaleDateString()}
      </Text>

      <View style={styles.actions}>
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
  duration: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
}); 