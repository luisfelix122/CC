import { Gauge } from '../components/Gauge';
import { WaterGlass } from '../components/WaterGlass';
import { addWater, deleteFood } from '../lib/api';
import { localDateKey, waterProgress } from '../lib/stats';
import type { DayTotals } from '../lib/types';
import type { AppData } from '../hooks/useData';

interface Props {
  data: AppData;
  totals: DayTotals;
  onError: (m: string) => void;
}

/** CU-06: panel diario con KPIs. */
export function Dashboard({ data, totals, onError }: Props) {
  const { goals } = data;
  const kcalLeft = goals.kcal_goal - totals.kcal;
  const today = localDateKey(new Date());
  const todayFood = data.food.filter((f) => localDateKey(new Date(f.eaten_at)) === today);

  const quickWater = async () => {
    try {
      await addWater(250);
      await data.refresh();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteFood(id);
      await data.refresh();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  return (
    <section className="stack">
      <div className="panel instruments">
        <Gauge value={totals.kcal} max={goals.kcal_goal} label="Calorías" unit="kcal" />
        <div className="glass-wrap">
          <WaterGlass ml={totals.water_ml} goal={goals.water_goal_ml} onTap={quickWater} />
          <div className="gauge-label">Agua · toca +250 ml</div>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi plate">
          <span className="kpi-label">Llevo</span>
          <strong>{totals.kcal}</strong>
          <span>kcal</span>
        </div>
        <div className={`kpi plate ${kcalLeft < 0 ? 'over' : ''}`}>
          <span className="kpi-label">{kcalLeft >= 0 ? 'Me quedan' : 'Exceso'}</span>
          <strong>{Math.abs(kcalLeft)}</strong>
          <span>kcal</span>
        </div>
        <div className="kpi plate">
          <span className="kpi-label">Hidratación</span>
          <strong>{waterProgress(totals.water_ml, goals.water_goal_ml)}%</strong>
          <span>
            {totals.water_ml} / {goals.water_goal_ml} ml
          </span>
        </div>
      </div>

      <div className="panel paper">
        <h2>Macros de hoy</h2>
        <div className="macros">
          <span>🥩 Proteína {totals.protein_g} g</span>
          <span>🍞 Carbs {totals.carbs_g} g</span>
          <span>🧈 Grasa {totals.fat_g} g</span>
        </div>
      </div>

      <div className="panel paper">
        <h2>Comidas de hoy</h2>
        {todayFood.length === 0 && <p className="muted">Aún no registras comidas hoy.</p>}
        <ul className="entries">
          {todayFood.map((f) => (
            <li key={f.id}>
              <span>
                {f.kind === 'label' ? '📦' : '🍽️'} {f.name}
                <small>
                  {new Date(f.eaten_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </span>
              <strong>{Math.round(f.kcal)} kcal</strong>
              <button className="icon-btn" onClick={() => remove(f.id)} aria-label="Eliminar">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
