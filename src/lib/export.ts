import type { DaySummary, Goals } from './types';

export function toCsv(days: DaySummary[], g: Pick<Goals, 'kcal_goal' | 'water_goal_ml'>): string {
  const header = 'fecha,kcal,proteina_g,carbohidratos_g,grasa_g,agua_ml,meta_kcal,meta_agua_ml';
  const rows = days.map((d) =>
    [
      d.date,
      d.kcal,
      d.protein_g,
      d.carbs_g,
      d.fat_g,
      d.water_ml,
      g.kcal_goal,
      g.water_goal_ml,
    ].join(','),
  );
  return [header, ...rows].join('\n') + '\n';
}

export function downloadText(filename: string, text: string, mime = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
