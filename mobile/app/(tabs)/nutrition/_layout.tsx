import { Stack } from 'expo-router';

export default function NutritionLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerTitle: "Детали питания",
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 