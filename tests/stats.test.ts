import { describe, expect, it } from 'vitest';
import {
  dayTotals,
  lastNDays,
  reminderMessage,
  resolveGoals,
  waterProgress,
} from '../src/lib/stats';

const now = new Date(2026, 9, 7, 15, 0);
const iso = (d: number, h = 12) => new Date(2026, 9, d, h).toISOString();

describe('CU-05 resolveGoals', () => {
  it('usa 2000/2000 por defecto', () => {
    expect(resolveGoals(null)).toMatchObject({ kcal_goal: 2000, water_goal_ml: 2000 });
  });
});

describe('CU-04/06 totales del día', () => {
  const food = [
    { eaten_at: iso(7), kcal: 500, protein_g: 20, carbs_g: 50, fat_g: 10 },
    { eaten_at: iso(6), kcal: 900, protein_g: 0, carbs_g: 0, fat_g: 0 },
  ];
  const water = [
    { drank_at: iso(7), ml: 250 },
    { drank_at: iso(7, 9), ml: 500 },
    { drank_at: iso(5), ml: 1000 },
  ];
  it('solo cuenta el día local actual', () => {
    const t = dayTotals(food, water, now);
    expect(t.kcal).toBe(500);
    expect(t.water_ml).toBe(750);
  });
  it('progreso de agua 37.5%', () => {
    expect(waterProgress(750, 2000)).toBe(37.5);
  });
});

describe('CU-07 lastNDays', () => {
  it('devuelve 7 días consecutivos terminando hoy con ceros', () => {
    const days = lastNDays(
      [{ eaten_at: iso(6), kcal: 900, protein_g: 0, carbs_g: 0, fat_g: 0 }],
      [],
      7,
      now,
    );
    expect(days).toHaveLength(7);
    expect(days[6].date).toBe('2026-10-07');
    expect(days[0].date).toBe('2026-10-01');
    expect(days[5].kcal).toBe(900);
    expect(days[4].kcal).toBe(0);
  });
});

describe('CU-08 reminderMessage', () => {
  const goals = resolveGoals(null);
  it('no recuerda agua si la meta está cumplida', () => {
    const msg = reminderMessage(
      { kcal: 2000, water_ml: 2000, protein_g: 0, carbs_g: 0, fat_g: 0 },
      goals,
    );
    expect(msg).toBeNull();
  });
  it('recuerda agua faltante', () => {
    const msg = reminderMessage(
      { kcal: 2000, water_ml: 500, protein_g: 0, carbs_g: 0, fat_g: 0 },
      goals,
    );
    expect(msg).toContain('1500 ml');
  });
});
