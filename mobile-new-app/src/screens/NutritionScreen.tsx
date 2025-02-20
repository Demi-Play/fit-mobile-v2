import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { NutritionCard } from '../components/nutrition/NutritionCard';
import { nutritionApi } from '../services/api';
import { Nutrition } from '../types';

export const NutritionScreen = () => {
  const [nutritionRecords, setNutritionRecords] = useState<Nutrition[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNutrition = async () => {
    try {
      setLoading(true);
      const response = await nutritionApi.getAll();
      setNutritionRecords(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load nutrition records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNutrition();
    setRefreshing(false);
  };

  const handleDelete = async (nutrition: Nutrition) => {
    Alert.alert(
      'Delete Nutrition Record',
      'Are you sure you want to delete this nutrition record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await nutritionApi.delete(nutrition.id);
              loadNutrition();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete nutrition record');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (nutrition: Nutrition) => {
    // TODO: Навигация к экрану редактирования
    Alert.alert('Edit', 'Edit functionality will be implemented soon');
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={nutritionRecords}
        renderItem={({ item }) => (
          <NutritionCard
            nutrition={item}
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
          title="Add Nutrition"
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