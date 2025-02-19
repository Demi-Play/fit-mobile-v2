export interface Workout {
  id: number;
  name: string;
  description: string;
  duration: number;
  calories_burned: number;
  date: string;
  user: number;
}

export interface Nutrition {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  user: number;
}

export interface Goal {
  id: number;
  name: string;
  description: string;
  target_date: string;
  achieved: boolean;
  progress: number;
  category: 'workout' | 'nutrition' | 'weight' | 'other';
  user: number;
} 