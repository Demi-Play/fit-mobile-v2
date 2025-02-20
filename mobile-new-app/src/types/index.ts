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
  carbohydrates: number;
  fats: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: string;
  created_at?: string;
  updated_at?: string;
  user?: number;
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