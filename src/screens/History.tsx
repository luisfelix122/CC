import { useMemo } from 'react';
import { WeekChart } from '../components/WeekChart';
import { downloadText, toCsv } from '../lib/export';
import { lastNDays, localDateKey } from '../lib/stats';
import type { AppData } from '../hooks/useData';

/** CU-07 resumen semanal + CU-09 exportación. */
export function History({ data }: { data: AppData }) {
  const { goals } = data;
  const week = useMemo(() => lastNDays(data.food, data.water, 7), [data.food, data.water]);

  const logged = week.filter((d) => d.kcal > 0);
  const avgKcal = logged.length
    ? Math.round(logged.reduce((a, d) => a + d.kcal, 0) / logged.length)
    : 0;
  const avgWater = Math.round(week.reduce((a, d) => a + d.water_ml, 0) / week.length);
  const kcalDays = week.filter((d) => d.kcal > 0 && d.kcal <= goals.kcal_goal).length;
  const waterDays = week.filter((d) => d.water_ml >= goals.water_goal_ml).length;

  const exportCsv = (days: number) => {
    const rows = lastNDays(data.food, data.water, days);
    downloadText(`nutridiario-${days}d-${localDateKey(new Date())}.csv`, toCsv(rows, goals));
  };

  return (
    <section className="stack">
      <div className="kpis">
        <div className="kpi plate">
          <span className="kpi-label">Promedio</span>
          <strong>{avgKcal}</strong>
          <span>kcal/día registrado</span>
        </div>
        <div className="kpi plate">
          <span className="kpi-label">Promedio agua</span>
          <strong>{avgWater}</strong>
          <span>ml/día</span>
        </div>
        <div className="kpi plate">
          <span className="kpi-label">Metas cumplidas</span>
          <strong>
            {kcalDays}/{waterDays}
          </strong>
          <span>kcal / agua</span>
        </div>
      </div>

      <div className="panel paper">
        <h2>Calorías · últimos 7 días</h2>
        <WeekChart days={week} field="kcal" goal={goals.kcal_goal} color="#c8752b" unit="kcal" />
      </div>
      <div className="panel paper">
        <h2>Agua · últimos 7 días</h2>
        <WeekChart
          days={week}
          field="water_ml"
          goal={goals.water_goal_ml}
          color="#2a7fc0"
          unit="ml"
        />
      </div>

      <div className="panel paper print-only-table">
        <h2>Detalle</h2>
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>kcal</th>
              <th>P</th>
              <th>C</th>
              <th>G</th>
              <th>Agua</th>
            </tr>
          </thead>
          <tbody>
            {week.map((d) => (
              <tr key={d.date}>
                <td>{d.date.slice(5)}</td>
                <td>{d.kcal}</td>
                <td>{d.protein_g}</td>
                <td>{d.carbs_g}</td>
                <td>{d.fat_g}</td>
                <td>{d.water_ml}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="presets no-print">
        <button className="tactile" onClick={() => exportCsv(7)}>
          ⬇ CSV semanal
        </button>
        <button className="tactile" onClick={() => exportCsv(30)}>
          ⬇ CSV mensual
        </button>
        <button className="tactile" onClick={() => window.print()}>
          🖨 PDF / Imprimir
        </button>
      </div>
    </section>
  );
}
