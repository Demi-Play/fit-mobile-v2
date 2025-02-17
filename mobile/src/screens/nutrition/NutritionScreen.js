import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, Portal, Modal, TextInput, SegmentedButtons } from 'react-native-paper';
import api from '../../utils/api';

const NutritionScreen = ({ navigation }) => {
  const [nutrition, setNutrition] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newNutrition, setNewNutrition] = useState({
    meal_type: 'breakfast',
    calories: '',
    protein: '',
    carbohydrates: '',
    fats: ''
  });

  const loadNutrition = async () => {
    try {
      const response = await api.get('/nutrition/');
      setNutrition(response.data);
    } catch (error) {
      console.error('Error loading nutrition:', error);
    }
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const handleAddNutrition = async () => {
    try {
      await api.post('/nutrition/', {
        ...newNutrition,
        calories: parseInt(newNutrition.calories),
        protein: parseFloat(newNutrition.protein),
        carbohydrates: parseFloat(newNutrition.carbohydrates),
        fats: parseFloat(newNutrition.fats)
      });
      setVisible(false);
      setNewNutrition({
        meal_type: 'breakfast',
        calories: '',
        protein: '',
        carbohydrates: '',
        fats: ''
      });
      loadNutrition();
    } catch (error) {
      console.error('Error adding nutrition:', error);
    }
  };

  const getMealTypeLabel = (type) => {
    const types = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус'
    };
    return types[type] || type;
  };

  const renderNutrition = ({ item }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('NutritionDetail', { nutrition: item })}
    >
      <Card.Content>
        <Title>{getMealTypeLabel(item.meal_type)}</Title>
        <Paragraph>Калории: {item.calories} ккал</Paragraph>
        <Paragraph>Белки: {item.protein}г</Paragraph>
        <Paragraph>Углеводы: {item.carbohydrates}г</Paragraph>
        <Paragraph>Жиры: {item.fats}г</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={nutrition}
        renderItem={renderNutrition}
        keyExtractor={item => item.id.toString()}
      />
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <Card style={styles.modal}>
            <Card.Content>
              <SegmentedButtons
                value={newNutrition.meal_type}
                onValueChange={value => setNewNutrition({...newNutrition, meal_type: value})}
                buttons={[
                  { value: 'breakfast', label: 'Завтрак' },
                  { value: 'lunch', label: 'Обед' },
                  { value: 'dinner', label: 'Ужин' },
                  { value: 'snack', label: 'Перекус' },
                ]}
              />
              <TextInput
                label="Калории (ккал)"
                value={newNutrition.calories}
                onChangeText={text => setNewNutrition({...newNutrition, calories: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Белки (г)"
                value={newNutrition.protein}
                onChangeText={text => setNewNutrition({...newNutrition, protein: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Углеводы (г)"
                value={newNutrition.carbohydrates}
                onChangeText={text => setNewNutrition({...newNutrition, carbohydrates: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Жиры (г)"
                value={newNutrition.fats}
                onChangeText={text => setNewNutrition({...newNutrition, fats: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleAddNutrition}>
                Добавить
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    margin: 20,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
});

export default NutritionScreen; 