import type { DaySummary } from '../lib/types';

interface Props {
  days: DaySummary[];
  field: 'kcal' | 'water_ml';
  goal: number;
  color: string;
  unit: string;
}

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

/** Barras de los últimos días con línea de meta (CU-07). */
export function WeekChart({ days, field, goal, color, unit }: Props) {
  const max = Math.max(goal * 1.2, ...days.map((d) => d[field]), 1);
  const w = 320;
  const h = 160;
  const bw = w / days.length;
  const y = (v: number) => h - (v / max) * h;

  return (
    <svg
      viewBox={`0 0 ${w} ${h + 22}`}
      className="week-chart"
      role="img"
      aria-label={`Gráfico ${unit}`}
    >
      {days.map((d, i) => {
        const v = d[field];
        const ok = field === 'kcal' ? v > 0 && v <= goal : v >= goal;
        const [yy, mm, dd] = d.date.split('-').map(Number);
        return (
          <g key={d.date}>
            <rect
              x={i * bw + bw * 0.18}
              y={y(v)}
              width={bw * 0.64}
              height={h - y(v)}
              rx="10"
              fill={color}
              opacity={ok ? 1 : 0.6}
            >
              <title>{`${d.date}: ${Math.round(v)} ${unit}`}</title>
            </rect>
            <text x={i * bw + bw / 2} y={h + 16} textAnchor="middle" className="axis">
              {WEEKDAYS[new Date(yy, mm - 1, dd).getDay()]}
            </text>
          </g>
        );
      })}
      <line x1="0" x2={w} y1={y(goal)} y2={y(goal)} stroke="#e5484d" strokeDasharray="5 4" />
      <text x={w - 4} y={y(goal) - 4} textAnchor="end" className="axis">
        meta {goal}
      </text>
    </svg>
  );
}
