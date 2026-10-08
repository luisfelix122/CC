import { describe, expect, it } from 'vitest';
import { toCsv } from '../src/lib/export';

describe('CU-09 toCsv', () => {
  it('cabecera + una fila por día', () => {
    const csv = toCsv(
      [
        { date: '2026-10-06', kcal: 1800, protein_g: 80, carbs_g: 200, fat_g: 60, water_ml: 1500 },
        { date: '2026-10-07', kcal: 500, protein_g: 20, carbs_g: 50, fat_g: 10, water_ml: 750 },
      ],
      { kcal_goal: 2000, water_goal_ml: 2000 },
    );
    const lines = csv.trim().split('\n');
    expect(lines[0]).toBe(
      'fecha,kcal,proteina_g,carbohidratos_g,grasa_g,agua_ml,meta_kcal,meta_agua_ml',
    );
    expect(lines).toHaveLength(3);
    expect(lines[2]).toBe('2026-10-07,500,20,50,10,750,2000,2000');
  });
});
