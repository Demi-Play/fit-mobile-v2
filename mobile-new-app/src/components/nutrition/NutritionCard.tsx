import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Nutrition } from '../../types';

interface NutritionCardProps {
  nutrition: Nutrition;
  onEdit: () => void;
  onDelete: () => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  nutrition,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{nutrition.name}</Text>
        <Text style={[styles.mealType, styles[`mealType_${nutrition.meal_type}`]]}>
          {nutrition.meal_type}
        </Text>
      </View>

      <View style={styles.macros}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{nutrition.calories}</Text>
          <Text style={styles.macroLabel}>Calories</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{nutrition.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{nutrition.carbohydrates}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{nutrition.fats}g</Text>
          <Text style={styles.macroLabel}>Fats</Text>
        </View>
      </View>

      {nutrition.date && (
        <Text style={styles.date}>
          {new Date(nutrition.date).toLocaleDateString()}
        </Text>
      )}

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
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  mealType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '500',
  },
  mealType_breakfast: {
    backgroundColor: '#5856D6',
    color: '#FFFFFF',
  },
  mealType_lunch: {
    backgroundColor: '#FF9500',
    color: '#FFFFFF',
  },
  mealType_dinner: {
    backgroundColor: '#FF2D55',
    color: '#FFFFFF',
  },
  mealType_snack: {
    backgroundColor: '#34C759',
    color: '#FFFFFF',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  macroLabel: {
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