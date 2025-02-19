import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerTitle: "Детали тренировки",
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 