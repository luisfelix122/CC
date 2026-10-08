export interface Macros {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface FoodItem extends Macros {
  name: string;
  grams: number;
}

export type FoodKind = 'label' | 'plate';

export interface FoodEntry extends Macros {
  id: string;
  device_id: string;
  eaten_at: string;
  kind: FoodKind;
  name: string;
  description: string | null;
  items: FoodItem[];
  quantity_g: number | null;
}

export interface WaterEntry {
  id: string;
  device_id: string;
  drank_at: string;
  ml: number;
}

export interface Goals {
  kcal_goal: number;
  water_goal_ml: number;
  reminder_minutes: number;
  reminders_on: boolean;
}

export interface DayTotals extends Macros {
  water_ml: number;
}

export interface DaySummary extends DayTotals {
  date: string;
}
