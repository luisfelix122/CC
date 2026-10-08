import { sumItems } from './nutrition';
import type { DaySummary, DayTotals, Goals, Macros } from './types';

type FoodLike = Macros & { eaten_at: string };
type WaterLike = { drank_at: string; ml: number };

export const DEFAULT_GOALS: Goals = {
  kcal_goal: 2000,
  water_goal_ml: 2000,
  reminder_minutes: 60,
  reminders_on: false,
};

export function resolveGoals(g: Partial<Goals> | null | undefined): Goals {
  return { ...DEFAULT_GOALS, ...(g ?? {}) };
}

export function localDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const keyOf = (isoString: string) => localDateKey(new Date(isoString));

function totalsFor(food: FoodLike[], water: WaterLike[], key: string): DayTotals {
  const m = sumItems(food.filter((f) => keyOf(f.eaten_at) === key));
  const water_ml = water.filter((w) => keyOf(w.drank_at) === key).reduce((a, w) => a + w.ml, 0);
  return { ...m, water_ml };
}

export function dayTotals(food: FoodLike[], water: WaterLike[], now = new Date()): DayTotals {
  return totalsFor(food, water, localDateKey(now));
}

export function lastNDays(
  food: FoodLike[],
  water: WaterLike[],
  n: number,
  now = new Date(),
): DaySummary[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (n - 1 - i));
    const date = localDateKey(d);
    return { date, ...totalsFor(food, water, date) };
  });
}

export function waterProgress(ml: number, goal: number): number {
  return goal > 0 ? Math.round((ml / goal) * 1000) / 10 : 0;
}

export function reminderMessage(t: DayTotals, g: Goals): string | null {
  const parts: string[] = [];
  const waterLeft = g.water_goal_ml - t.water_ml;
  if (waterLeft > 0) parts.push(`Te faltan ${waterLeft} ml de agua 💧`);
  const kcalLeft = g.kcal_goal - t.kcal;
  if (kcalLeft > 0 && waterLeft > 0) parts.push(`y ${kcalLeft} kcal para tu meta`);
  return parts.length ? parts.join(' ') : null;
}

export function startOfDayNDaysAgo(n: number, now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - n);
}
