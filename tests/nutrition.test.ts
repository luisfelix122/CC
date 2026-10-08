import { describe, expect, it } from 'vitest';
import { scaleItem, scaleLabel, sumItems } from '../src/lib/nutrition';

describe('CU-01 scaleLabel', () => {
  it('calcula kcal por cantidad desde valores por 100 g', () => {
    const r = scaleLabel({ kcal: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2 }, 150);
    expect(r.kcal).toBe(78);
    expect(r.carbs_g).toBe(21);
  });
  it('cantidad negativa o inválida da 0', () => {
    expect(scaleLabel({ kcal: 100, protein_g: 1, carbs_g: 1, fat_g: 1 }, -5).kcal).toBe(0);
  });
});

describe('CU-02 sumItems', () => {
  it('suma kcal y macros', () => {
    const t = sumItems([
      { name: 'a', grams: 100, kcal: 200, protein_g: 10, carbs_g: 20, fat_g: 5 },
      { name: 'b', grams: 50, kcal: 150, protein_g: 2, carbs_g: 30, fat_g: 1 },
    ]);
    expect(t).toEqual({ kcal: 350, protein_g: 12, carbs_g: 50, fat_g: 6 });
  });
});

describe('CU-03 scaleItem', () => {
  const item = { name: 'arroz', grams: 100, kcal: 200, protein_g: 4, carbs_g: 44, fat_g: 0.4 };
  it('escala proporcionalmente a los nuevos gramos', () => {
    const r = scaleItem(item, 150);
    expect(r.grams).toBe(150);
    expect(r.kcal).toBe(300);
    expect(r.carbs_g).toBe(66);
  });
  it('no produce NaN si los gramos originales son 0', () => {
    const r = scaleItem({ ...item, grams: 0 }, 50);
    expect(Number.isNaN(r.kcal)).toBe(false);
  });
});
