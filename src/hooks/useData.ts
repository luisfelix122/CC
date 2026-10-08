import { useCallback, useEffect, useState } from 'react';
import { fetchFood, fetchGoals, fetchWater } from '../lib/api';
import { DEFAULT_GOALS } from '../lib/stats';
import type { FoodEntry, Goals, WaterEntry } from '../lib/types';

export const HISTORY_DAYS = 30;

export function useData() {
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
  const [food, setFood] = useState<FoodEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [g, f, w] = await Promise.all([
        fetchGoals(),
        fetchFood(HISTORY_DAYS),
        fetchWater(HISTORY_DAYS),
      ]);
      setGoals(g);
      setFood(f);
      setWater(w);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { goals, food, water, loading, error, refresh };
}

export type AppData = ReturnType<typeof useData>;
