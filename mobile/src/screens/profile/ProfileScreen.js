import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Portal, Modal } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    height: '',
    weight: '',
    age: '',
    goal_weight: '',
    daily_calorie_goal: ''
  });
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile/');
      setProfile({
        ...profile,
        ...response.data
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/users/profile/', {
        height: parseFloat(profile.height),
        weight: parseFloat(profile.weight),
        age: parseInt(profile.age),
        goal_weight: parseFloat(profile.goal_weight),
        daily_calorie_goal: parseInt(profile.daily_calorie_goal)
      });
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Пароли не совпадают');
      return;
    }
    try {
      await api.post('/users/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setChangePassword(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      alert('Пароль успешно изменен');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Ошибка при смене пароля');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Профиль</Title>
          <Paragraph>Имя пользователя: {profile.username}</Paragraph>
          <Paragraph>Email: {profile.email}</Paragraph>
          
          {!editing ? (
            <>
              <Paragraph>Рост: {profile.height} см</Paragraph>
              <Paragraph>Вес: {profile.weight} кг</Paragraph>
              <Paragraph>Возраст: {profile.age} лет</Paragraph>
              <Paragraph>Целевой вес: {profile.goal_weight} кг</Paragraph>
              <Paragraph>Дневная норма калорий: {profile.daily_calorie_goal} ккал</Paragraph>
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={() => setEditing(true)} style={styles.button}>
                  Редактировать
                </Button>
                <Button mode="outlined" onPress={() => setChangePassword(true)} style={styles.button}>
                  Сменить пароль
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={logout} 
                  style={styles.button}
                  color="red"
                >
                  Выйти
                </Button>
              </View>
            </>
          ) : (
            <>
              <TextInput
                label="Рост (см)"
                value={profile.height.toString()}
                onChangeText={text => setProfile({...profile, height: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Вес (кг)"
                value={profile.weight.toString()}
                onChangeText={text => setProfile({...profile, weight: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Возраст"
                value={profile.age.toString()}
                onChangeText={text => setProfile({...profile, age: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Целевой вес (кг)"
                value={profile.goal_weight.toString()}
                onChangeText={text => setProfile({...profile, goal_weight: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Дневная норма калорий"
                value={profile.daily_calorie_goal.toString()}
                onChangeText={text => setProfile({...profile, daily_calorie_goal: text})}
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>
                  Сохранить
                </Button>
                <Button mode="outlined" onPress={() => setEditing(false)} style={styles.button}>
                  Отмена
                </Button>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={changePassword}
          onDismiss={() => setChangePassword(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Content>
              <Title>Смена пароля</Title>
              <TextInput
                label="Текущий пароль"
                value={passwordData.old_password}
                onChangeText={text => setPasswordData({...passwordData, old_password: text})}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label="Новый пароль"
                value={passwordData.new_password}
                onChangeText={text => setPasswordData({...passwordData, new_password: text})}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label="Подтвердите новый пароль"
                value={passwordData.confirm_password}
                onChangeText={text => setPasswordData({...passwordData, confirm_password: text})}
                secureTextEntry
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                  Сменить пароль
                </Button>
                <Button mode="outlined" onPress={() => setChangePassword(false)} style={styles.button}>
                  Отмена
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  modal: {
    margin: 20,
    backgroundColor: 'white',
  },
});

export default ProfileScreen; 