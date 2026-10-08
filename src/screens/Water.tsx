import { useState } from 'react';
import { WaterGlass } from '../components/WaterGlass';
import { addWater, deleteWater } from '../lib/api';
import { localDateKey } from '../lib/stats';
import type { AppData } from '../hooks/useData';

interface Props {
  data: AppData;
  todayMl: number;
  onError: (m: string) => void;
}

const PRESETS = [
  { label: 'Vaso', ml: 250, icon: '🥛' },
  { label: 'Botella', ml: 500, icon: '🍶' },
  { label: 'Botella grande', ml: 1000, icon: '🧴' },
];

/** CU-04: registro rápido de hidratación. */
export function Water({ data, todayMl, onError }: Props) {
  const [custom, setCustom] = useState(300);
  const [busy, setBusy] = useState(false);
  const today = localDateKey(new Date());
  const todayEntries = data.water.filter((w) => localDateKey(new Date(w.drank_at)) === today);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      await data.refresh();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="stack">
      <div className="panel instruments single">
        <WaterGlass
          ml={todayMl}
          goal={data.goals.water_goal_ml}
          onTap={() => run(() => addWater(250))}
        />
        <p className="big-number">
          {todayMl} <small>/ {data.goals.water_goal_ml} ml</small>
        </p>
      </div>

      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.ml}
            className="tactile"
            disabled={busy}
            onClick={() => run(() => addWater(p.ml))}
          >
            <span className="preset-icon">{p.icon}</span>
            {p.label}
            <small>+{p.ml} ml</small>
          </button>
        ))}
      </div>

      <div className="panel paper row">
        <input
          type="number"
          min={1}
          value={custom}
          onChange={(e) => setCustom(Number(e.target.value))}
          aria-label="Cantidad personalizada en ml"
        />
        <button
          className="tactile"
          disabled={busy || custom <= 0}
          onClick={() => run(() => addWater(Math.round(custom)))}
        >
          + Añadir ml
        </button>
        <button
          className="tactile ghost"
          disabled={busy || todayEntries.length === 0}
          onClick={() => run(() => deleteWater(todayEntries[0].id))}
        >
          ↶ Deshacer último
        </button>
      </div>
    </section>
  );
}
