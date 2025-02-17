import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import api from '../../utils/api';

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { workout } = route.params;
  const [editing, setEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(workout);

  const handleUpdate = async () => {
    try {
      await api.put(`/workouts/${workout.id}/`, {
        ...editedWorkout,
        duration: parseInt(editedWorkout.duration),
        calories_burned: parseInt(editedWorkout.calories_burned)
      });
      setEditing(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Удаление тренировки",
      "Вы уверены, что хотите удалить эту тренировку?",
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "Удалить", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/workouts/${workout.id}/`);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting workout:', error);
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
            <TextInput
              label="Название"
              value={editedWorkout.name}
              onChangeText={text => setEditedWorkout({...editedWorkout, name: text})}
              style={styles.input}
            />
            <TextInput
              label="Описание"
              value={editedWorkout.description}
              onChangeText={text => setEditedWorkout({...editedWorkout, description: text})}
              style={styles.input}
            />
            <TextInput
              label="Длительность (мин)"
              value={editedWorkout.duration.toString()}
              onChangeText={text => setEditedWorkout({...editedWorkout, duration: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Сожжено калорий"
              value={editedWorkout.calories_burned.toString()}
              onChangeText={text => setEditedWorkout({...editedWorkout, calories_burned: text})}
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
          <Title>{workout.name}</Title>
          <Paragraph>{workout.description}</Paragraph>
          <Paragraph>Длительность: {workout.duration} мин</Paragraph>
          <Paragraph>Сожжено калорий: {workout.calories_burned}</Paragraph>
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

export default WorkoutDetailScreen; 