import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = 'fitness' | 'fitness-outline' | 'restaurant' | 'restaurant-outline' | 'person' | 'person-outline';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: IconName;

          switch (route.name) {
            case 'workouts':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'nutrition':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Тренировки',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Питание',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
        }}
      />
    </Tabs>
  );
} 