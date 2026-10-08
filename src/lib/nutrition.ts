import type { FoodItem, Macros } from './types';

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scaleLabel(per100g: Macros, grams: number): Macros {
  const f = Number.isFinite(grams) && grams > 0 ? grams / 100 : 0;
  return {
    kcal: Math.round(per100g.kcal * f),
    protein_g: round1(per100g.protein_g * f),
    carbs_g: round1(per100g.carbs_g * f),
    fat_g: round1(per100g.fat_g * f),
  };
}

export function scaleItem(item: FoodItem, grams: number): FoodItem {
  const g = Number.isFinite(grams) && grams > 0 ? grams : 0;
  const f = item.grams > 0 ? g / item.grams : 0;
  return {
    ...item,
    grams: g,
    kcal: Math.round(item.kcal * f),
    protein_g: round1(item.protein_g * f),
    carbs_g: round1(item.carbs_g * f),
    fat_g: round1(item.fat_g * f),
  };
}

export function sumItems<T extends Macros>(items: T[]): Macros {
  const t = items.reduce(
    (a, i) => ({
      kcal: a.kcal + i.kcal,
      protein_g: a.protein_g + i.protein_g,
      carbs_g: a.carbs_g + i.carbs_g,
      fat_g: a.fat_g + i.fat_g,
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );
  return {
    kcal: Math.round(t.kcal),
    protein_g: round1(t.protein_g),
    carbs_g: round1(t.carbs_g),
    fat_g: round1(t.fat_g),
  };
}
