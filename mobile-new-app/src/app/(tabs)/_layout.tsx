import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

interface RouteProps {
  name: string;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: RouteProps }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: IconName = 'home-outline';

          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'workouts':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'nutrition':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'goals':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'profile/index':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
        }}
      />
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
        name="goals"
        options={{
          title: 'Цели',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Профиль',
          headerTitle: 'Профиль',
        }}
      />
    </Tabs>
  );
} 