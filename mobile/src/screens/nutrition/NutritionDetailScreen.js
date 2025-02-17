import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import api from '../../utils/api';

const NutritionDetailScreen = ({ route, navigation }) => {
  const { nutrition } = route.params;
  const [editing, setEditing] = useState(false);
  const [editedNutrition, setEditedNutrition] = useState(nutrition);

  const getMealTypeLabel = (type) => {
    const types = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус'
    };
    return types[type] || type;
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/nutrition/${nutrition.id}/`, {
        ...editedNutrition,
        calories: parseInt(editedNutrition.calories),
        protein: parseFloat(editedNutrition.protein),
        carbohydrates: parseFloat(editedNutrition.carbohydrates),
        fats: parseFloat(editedNutrition.fats)
      });
      setEditing(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating nutrition:', error);
    }
  };

  const handleDelete = async () => {
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
              await api.delete(`/nutrition/${nutrition.id}/`);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting nutrition:', error);
            }
          }
        }
      ]
    );
  };

  if (editing) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <SegmentedButtons
              value={editedNutrition.meal_type}
              onValueChange={value => setEditedNutrition({...editedNutrition, meal_type: value})}
              buttons={[
                { value: 'breakfast', label: 'Завтрак' },
                { value: 'lunch', label: 'Обед' },
                { value: 'dinner', label: 'Ужин' },
                { value: 'snack', label: 'Перекус' },
              ]}
            />
            <TextInput
              label="Калории (ккал)"
              value={editedNutrition.calories.toString()}
              onChangeText={text => setEditedNutrition({...editedNutrition, calories: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Белки (г)"
              value={editedNutrition.protein.toString()}
              onChangeText={text => setEditedNutrition({...editedNutrition, protein: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Углеводы (г)"
              value={editedNutrition.carbohydrates.toString()}
              onChangeText={text => setEditedNutrition({...editedNutrition, carbohydrates: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Жиры (г)"
              value={editedNutrition.fats.toString()}
              onChangeText={text => setEditedNutrition({...editedNutrition, fats: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                Сохранить
              </Button>
              <Button mode="outlined" onPress={() => setEditing(false)} style={styles.button}>
                Отмена
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{getMealTypeLabel(nutrition.meal_type)}</Title>
          <Paragraph>Калории: {nutrition.calories} ккал</Paragraph>
          <Paragraph>Белки: {nutrition.protein}г</Paragraph>
          <Paragraph>Углеводы: {nutrition.carbohydrates}г</Paragraph>
          <Paragraph>Жиры: {nutrition.fats}г</Paragraph>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setEditing(true)} style={styles.button}>
              Редактировать
            </Button>
            <Button mode="outlined" onPress={handleDelete} style={styles.button} color="red">
              Удалить
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 5,
  },
});

export default NutritionDetailScreen; 