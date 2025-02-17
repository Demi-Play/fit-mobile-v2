import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, Portal, Modal, TextInput } from 'react-native-paper';
import api from '../../utils/api';

const WorkoutsScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    duration: '',
    calories_burned: ''
  });

  const loadWorkouts = async () => {
    try {
      const response = await api.get('/workouts/');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleAddWorkout = async () => {
    try {
      await api.post('/workouts/', {
        ...newWorkout,
        duration: parseInt(newWorkout.duration),
        calories_burned: parseInt(newWorkout.calories_burned)
      });
      setVisible(false);
      setNewWorkout({ name: '', description: '', duration: '', calories_burned: '' });
      loadWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const renderWorkout = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Длительность: {item.duration} мин</Paragraph>
        <Paragraph>Сожжено калорий: {item.calories_burned}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={item => item.id.toString()}
      />
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <Card style={styles.modal}>
            <Card.Content>
              <TextInput
                label="Название"
                value={newWorkout.name}
                onChangeText={text => setNewWorkout({...newWorkout, name: text})}
                style={styles.input}
              />
              <TextInput
                label="Описание"
                value={newWorkout.description}
                onChangeText={text => setNewWorkout({...newWorkout, description: text})}
                style={styles.input}
              />
              <TextInput
                label="Длительность (мин)"
                value={newWorkout.duration}
                onChangeText={text => setNewWorkout({...newWorkout, duration: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Сожжено калорий"
                value={newWorkout.calories_burned}
                onChangeText={text => setNewWorkout({...newWorkout, calories_burned: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleAddWorkout}>
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
  },
});

export default WorkoutsScreen; 