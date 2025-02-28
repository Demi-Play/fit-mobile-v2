import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Portal, Modal, TextInput, Avatar, Divider, SegmentedButtons, Switch } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { logger } from '../../utils/logger';
import { User } from '../../types';

interface EditableProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  height: string;
  weight: string;
  age: string;
  gender: User['gender'];
}

export default function ProfileScreen() {
  const { user, logout, updateUser, setTheme } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableProfile>({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
  });
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const profileData = {
        ...editableProfile,
        height: editableProfile.height ? parseFloat(editableProfile.height) : null,
        weight: editableProfile.weight ? parseFloat(editableProfile.weight) : null,
        age: editableProfile.age ? parseInt(editableProfile.age) : null,
        gender: editableProfile.gender || undefined,
        isDarkTheme,
      };
      
      logger.info('Updating profile with data:', profileData);
      await authApi.updateProfile(profileData);
      
      // Обновляем данные пользователя после успешного сохранения
      const response = await authApi.getProfile();
      logger.info('Profile updated, new data:', response.data);
      updateUser(response.data);
      
      hideModal();
    } catch (error) {
      logger.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender: User['gender']) => {
    switch (gender) {
      case 'M': return 'Мужской';
      case 'F': return 'Женский';
      case 'O': return 'Другой';
      default: return 'Не указано';
    }
  };

  const ProfileField = ({ label, value }: { label: string; value: string | undefined }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || 'Не указано'}</Text>
    </View>
  );

  const calculateBMI = (weight: number, height: number): string => {
    if (height === 0) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const calculateWHtR = (waist: number, height: number): string => {
    if (height === 0) return 'N/A';
    const whtr = waist / height;
    return whtr.toFixed(2);
  };

  const calculateBMR = (weight: number, height: number, age: number, gender: User['gender']): string => {
    if (!weight || !height || !age) return 'N/A';
    let bmr = 0;
    if (gender === 'M') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else if (gender === 'F') {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    } else {
      return 'N/A';
    }
    return bmr.toFixed(0);
  };

  const bmi = calculateBMI(user?.weight || 0, user?.height || 0);
  const waist = user?.height ? user.height * 0.8 : 0; // Example waist circumference
  const whtr = calculateWHtR(waist, user?.height || 0);
  const bmr = calculateBMR(user?.weight || 0, user?.height || 0, user?.age || 0, user?.gender || 'O');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.username?.substring(0, 2).toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username}</Text>
        <Button 
          mode="contained" 
          onPress={showModal}
          style={styles.editButton}
        >
          Редактировать профиль
        </Button>
        {/* <Switch
          value={isDarkTheme}
          onValueChange={() => {
            setIsDarkTheme(!isDarkTheme);
            setTheme(isDarkTheme ? 'dark' : 'light');
          }}
          style={styles.switch}
        /> */}
        {/* <Text style={styles.switchLabel}>Темная тема</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основная информация</Text>
        <Divider style={styles.divider} />
        <ProfileField label="Email" value={user?.email} />
        <ProfileField label="Имя" value={user?.first_name} />
        <ProfileField label="Фамилия" value={user?.last_name} />
        <ProfileField label="О себе" value={user?.bio} />
      </View>

      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Физические показатели</Text>
        <Divider style={styles.divider} />
        <Text style={styles.metricLabel}>Индекс массы тела (ИМТ): {bmi}</Text>
        <Text style={styles.metricLabel}>Индекс талии к росту (WHtR): {whtr}</Text>
        <Text style={styles.metricLabel}>Основной обмен веществ (BMR): {bmr} ккал/день</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Физические параметры</Text>
        <Divider style={styles.divider} />
        <ProfileField label="Рост" value={user?.height ? `${user.height} см` : undefined} />
        <ProfileField label="Вес" value={user?.weight ? `${user.weight} кг` : undefined} />
        <ProfileField label="Возраст" value={user?.age?.toString()} />
        <ProfileField label="Пол" value={getGenderLabel(user?.gender)} />
      </View>

      <Button 
        mode="contained" 
        onPress={logout}
        style={styles.logoutButton}
        buttonColor="#FF3B30"
      >
        Выйти
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Редактировать профиль</Text>
            
            <TextInput
              label="Имя пользователя"
              value={editableProfile.username}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, username: text }))}
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={editableProfile.email}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, email: text }))}
              style={styles.input}
              keyboardType="email-address"
            />
            
            <TextInput
              label="Имя"
              value={editableProfile.first_name}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, first_name: text }))}
              style={styles.input}
            />
            
            <TextInput
              label="Фамилия"
              value={editableProfile.last_name}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, last_name: text }))}
              style={styles.input}
            />
            
            <TextInput
              label="О себе"
              value={editableProfile.bio}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, bio: text }))}
              style={styles.input}
              multiline
            />
            
            <TextInput
              label="Рост (см)"
              value={editableProfile.height}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, height: text }))}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <TextInput
              label="Вес (кг)"
              value={editableProfile.weight}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, weight: text }))}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <TextInput
              label="Возраст"
              value={editableProfile.age}
              onChangeText={(text: string) => setEditableProfile(prev => ({ ...prev, age: text }))}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <SegmentedButtons
              value={editableProfile.gender}
              onValueChange={(value: User['gender']) => 
                setEditableProfile(prev => ({ ...prev, gender: value }))
              }
              buttons={[
                { value: 'M', label: 'Мужской' },
                { value: 'F', label: 'Женский' },
                { value: 'O', label: 'Другой' },
              ]}
              style={styles.segmentedButtons}
            />

            <Button 
              mode="contained" 
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            >
              Сохранить
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bmiLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  editButton: {
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  divider: {
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 10,
  },
  segmentedButtons: {
    marginBottom: 10,
  },
  switch: {
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  metricsContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
}); 