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
  onAddFood: () => void;
}

/** CU-06: panel diario con KPIs. */
export function Dashboard({ data, totals, onError, onAddFood }: Props) {
  const { goals } = data;
  const kcalLeft = goals.kcal_goal - totals.kcal;
  const waterPct = waterProgress(totals.water_ml, goals.water_goal_ml);
  const today = localDateKey(new Date());
  const todayFood = data.food.filter((f) => localDateKey(new Date(f.eaten_at)) === today);

  const run = async (fn: () => Promise<void>) => {
    try {
      await fn();
      await data.refresh();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  return (
    <section className="stack">
      <button className="search-pill" onClick={onAddFood}>
        <span aria-hidden="true">📷</span>
        ¿Qué comiste? Toma una foto
      </button>

      <div className="hero-pair">
        <article className="card card-ink">
          <h2>Calorías</h2>
          <Gauge value={totals.kcal} max={goals.kcal_goal} unit="kcal" />
          <div className="card-foot">
            <span className="chip chip-ink">
              {kcalLeft >= 0 ? `Quedan ${kcalLeft}` : `+${-kcalLeft} de más`}
            </span>
            <button className="round-btn on-ink" onClick={onAddFood} aria-label="Registrar comida">
              +
            </button>
          </div>
        </article>

        <article className="card card-white">
          <h2>Agua</h2>
          <WaterGlass
            ml={totals.water_ml}
            goal={goals.water_goal_ml}
            onTap={() => run(() => addWater(250))}
          />
          <div className="card-foot">
            <span className="chip">{waterPct}%</span>
            <button
              className="round-btn"
              onClick={() => run(() => addWater(250))}
              aria-label="Sumar 250 ml de agua"
            >
              +
            </button>
          </div>
        </article>
      </div>

      <div className="section-head">
        <h2>Tu día</h2>
      </div>

      <article className="card card-sky row-card">
        <div>
          <h3>Macronutrientes</h3>
          <div className="chips">
            <span className="chip">Proteína {totals.protein_g} g</span>
            <span className="chip">Carbos {totals.carbs_g} g</span>
            <span className="chip">Grasa {totals.fat_g} g</span>
          </div>
        </div>
      </article>

      <article className="card card-white row-card">
        <div>
          <h3>Hidratación</h3>
          <div className="chips">
            <span className="chip">
              {totals.water_ml} de {goals.water_goal_ml} ml
            </span>
          </div>
        </div>
        <button
          className="round-btn"
          onClick={() => run(() => addWater(500))}
          aria-label="Sumar una botella de 500 ml"
        >
          <small>+500</small>
        </button>
      </article>

      <div className="section-head">
        <h2>Comidas de hoy</h2>
      </div>
      {todayFood.length === 0 ? (
        <button className="card card-dashed" onClick={onAddFood}>
          Aún no registras comidas. Toma una foto de tu primer plato.
        </button>
      ) : (
        <ul className="meal-list">
          {todayFood.map((f) => (
            <li key={f.id} className="card card-white row-card">
              <div>
                <h3>{f.name}</h3>
                <div className="chips">
                  <span className="chip">{Math.round(f.kcal)} kcal</span>
                  <span className="chip">
                    {new Date(f.eaten_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="chip">{f.kind === 'label' ? 'Producto' : 'Plato'}</span>
                </div>
              </div>
              <button
                className="round-btn ghost"
                onClick={() => run(() => deleteFood(f.id))}
                aria-label={`Eliminar ${f.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
