import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, FAB, Portal, Modal, TextInput, Button, SegmentedButtons, IconButton } from 'react-native-paper';
import { Nutrition } from '../../../src/types';
import { nutritionApi } from '../../../src/services/api';
import { logger } from '../../../src/utils/logger';

export default function NutritionScreen() {
  const [meals, setMeals] = useState<Nutrition[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Nutrition | null>(null);
  const [newMeal, setNewMeal] = useState({
    calories: '',
    protein: '',
    carbohydrates: '',
    fats: '',
    meal_type: 'breakfast' as Nutrition['meal_type'],
    date: new Date().toISOString()
  });

  const loadMeals = async () => {
    try {
      setLoading(true);
      const response = await nutritionApi.getAll();
      setMeals(response.data || []);
    } catch (error) {
      logger.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleDelete = (meal: Nutrition) => {
    Alert.alert(
      "Удаление записи",
      "Вы уверены, что хотите удалить эту запись?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await nutritionApi.delete(meal.id);
              loadMeals();
            } catch (error) {
              logger.error('Error deleting meal:', error);
            }
          }
        }
      ]
    );
  };

  const handleEdit = (meal: Nutrition) => {
    setEditingMeal(meal);
    setNewMeal({
      calories: meal.calories?.toString() || '',
      protein: meal.protein?.toString() || '',
      carbohydrates: meal.carbohydrates?.toString() || '',
      fats: meal.fats?.toString() || '',
      meal_type: meal.meal_type,
      date: meal.date || new Date().toISOString()
    });
    setVisible(true);
  };

  const handleSave = async () => {
    try {
      const mealData = {
        ...newMeal,
        calories: parseInt(newMeal.calories) || 0,
        protein: parseFloat(newMeal.protein) || 0,
        carbohydrates: parseFloat(newMeal.carbohydrates) || 0,
        fats: parseFloat(newMeal.fats) || 0
      };

      if (editingMeal) {
        await nutritionApi.update(editingMeal.id, mealData);
      } else {
        await nutritionApi.create(mealData);
      }

      setVisible(false);
      setEditingMeal(null);
      setNewMeal({
        calories: '',
        protein: '',
        carbohydrates: '',
        fats: '',
        meal_type: 'breakfast',
        date: new Date().toISOString()
      });
      loadMeals();
    } catch (error) {
      logger.error('Error saving meal:', error);
    }
  };

  const renderMealItem = ({ item }: { item: Nutrition }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{getMealTypeLabel(item.meal_type)}</Text>
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEdit(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
      <Text>Калории: {item.calories || 0} ккал</Text>
      <Text>Белки: {item.protein || 0}г</Text>
      <Text>Углеводы: {item.carbohydrates || 0}г</Text>
      <Text>Жиры: {item.fats || 0}г</Text>
    </View>
  );

  const getMealTypeLabel = (type: Nutrition['meal_type']) => {
    const types = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус'
    };
    return types[type] || type;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => `${item.id || Math.random()}`}
        refreshing={loading}
        onRefresh={loadMeals}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisible(false);
            setEditingMeal(null);
          }}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMeal ? 'Редактировать приём пищи' : 'Добавить приём пищи'}
            </Text>

            <SegmentedButtons
              value={newMeal.meal_type}
              onValueChange={(value: string) => setNewMeal({...newMeal, meal_type: value as Nutrition['meal_type']})}
              buttons={[
                { value: 'breakfast', label: 'Завтрак' },
                { value: 'lunch', label: 'Обед' },
                { value: 'dinner', label: 'Ужин' },
                { value: 'snack', label: 'Перекус' },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Калории (ккал)"
              value={newMeal.calories}
              onChangeText={(text: string) => setNewMeal({...newMeal, calories: text})}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Белки (г)"
              value={newMeal.protein}
              onChangeText={(text: string) => setNewMeal({...newMeal, protein: text})}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Углеводы (г)"
              value={newMeal.carbohydrates}
              onChangeText={(text: string) => setNewMeal({...newMeal, carbohydrates: text})}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Жиры (г)"
              value={newMeal.fats}
              onChangeText={(text: string) => setNewMeal({...newMeal, fats: text})}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button mode="contained" onPress={handleSave} style={styles.button}>
              {editingMeal ? 'Сохранить' : 'Добавить'}
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setEditingMeal(null);
          setNewMeal({
            calories: '',
            protein: '',
            carbohydrates: '',
            fats: '',
            meal_type: 'breakfast',
            date: new Date().toISOString()
          });
          setVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mealItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});