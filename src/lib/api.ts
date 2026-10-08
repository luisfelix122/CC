import { getDeviceId } from './device';
import { resolveGoals, startOfDayNDaysAgo } from './stats';
import { supabase } from './supabase';
import type { FoodEntry, Goals, WaterEntry } from './types';

const dev = () => getDeviceId();

function check<T>(res: { data: T | null; error: { message: string; code?: string } | null }): T {
  if (res.error) {
    const missingTable =
      res.error.code === '42P01' ||
      res.error.code === 'PGRST205' ||
      /does not exist|schema cache/i.test(res.error.message);
    const hint = missingTable ? ' — ¿ejecutaste supabase/schema.sql en el SQL Editor?' : '';
    throw new Error(res.error.message + hint);
  }
  return res.data as T;
}

export async function fetchGoals(): Promise<Goals> {
  const data = check(
    await supabase
      .from('goals')
      .select('kcal_goal,water_goal_ml,reminder_minutes,reminders_on')
      .eq('device_id', dev())
      .maybeSingle(),
  ) as Partial<Goals> | null;
  return resolveGoals(data);
}

export async function saveGoals(g: Goals) {
  check(
    await supabase
      .from('goals')
      .upsert({ device_id: dev(), ...g, updated_at: new Date().toISOString() }),
  );
}

export async function fetchFood(days: number): Promise<FoodEntry[]> {
  const since = startOfDayNDaysAgo(days - 1).toISOString();
  const data = check(
    await supabase
      .from('food_entries')
      .select('*')
      .eq('device_id', dev())
      .gte('eaten_at', since)
      .order('eaten_at', { ascending: false }),
  ) as FoodEntry[];
  return data.map((f) => ({
    ...f,
    kcal: Number(f.kcal),
    protein_g: Number(f.protein_g),
    carbs_g: Number(f.carbs_g),
    fat_g: Number(f.fat_g),
  }));
}

export async function fetchWater(days: number): Promise<WaterEntry[]> {
  const since = startOfDayNDaysAgo(days - 1).toISOString();
  return check(
    await supabase
      .from('water_entries')
      .select('*')
      .eq('device_id', dev())
      .gte('drank_at', since)
      .order('drank_at', { ascending: false }),
  ) as WaterEntry[];
}

export async function addWater(ml: number) {
  check(await supabase.from('water_entries').insert({ device_id: dev(), ml }));
}

export async function deleteWater(id: string) {
  check(await supabase.from('water_entries').delete().eq('id', id).eq('device_id', dev()));
}

export async function addFood(e: Omit<FoodEntry, 'id' | 'device_id' | 'eaten_at'>) {
  check(await supabase.from('food_entries').insert({ device_id: dev(), ...e }));
}

export async function deleteFood(id: string) {
  check(await supabase.from('food_entries').delete().eq('id', id).eq('device_id', dev()));
}
