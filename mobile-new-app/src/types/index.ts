export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: 'M' | 'F' | 'O' | '';
}

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
  goal_type: 'strength' | 'endurance' | 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'flexibility' | 'other';
  target_weight: string;
  created_at?: string;
  updated_at?: string;
  user?: number;
} 