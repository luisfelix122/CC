import { useState } from 'react';
import { saveGoals } from '../lib/api';
import type { Goals } from '../lib/types';
import type { AppData } from '../hooks/useData';

interface Props {
  data: AppData;
  onError: (m: string) => void;
  onSaved: () => void;
}

/** CU-05 metas + CU-08 recordatorios. */
export function Settings({ data, onError, onSaved }: Props) {
  const [g, setG] = useState<Goals>(data.goals);
  const [busy, setBusy] = useState(false);

  const valid = g.kcal_goal > 0 && g.water_goal_ml > 0 && g.reminder_minutes > 0;
  const num = (field: keyof Goals) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setG({ ...g, [field]: Number(e.target.value) });

  const save = async () => {
    setBusy(true);
    try {
      if (g.reminders_on && 'Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      await saveGoals(g);
      await data.refresh();
      onSaved();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="stack">
      <div className="panel paper form">
        <h2>Metas diarias</h2>
        <label>
          Calorías (kcal)
          <input type="number" min={1} value={g.kcal_goal} onChange={num('kcal_goal')} />
        </label>
        <label>
          Agua (ml)
          <input type="number" min={1} value={g.water_goal_ml} onChange={num('water_goal_ml')} />
        </label>
      </div>

      <div className="panel paper form">
        <h2>Recordatorios</h2>
        <label className="switch">
          <input
            type="checkbox"
            checked={g.reminders_on}
            onChange={(e) => setG({ ...g, reminders_on: e.target.checked })}
          />
          <span className="toggle" /> Avisarme del agua y calorías faltantes
        </label>
        <label>
          Cada (minutos)
          <input
            type="number"
            min={1}
            value={g.reminder_minutes}
            onChange={num('reminder_minutes')}
          />
        </label>
        <p className="muted">Funcionan mientras la app esté abierta.</p>
      </div>

      <button className="tactile primary" disabled={!valid || busy} onClick={save}>
        {busy ? 'Guardando…' : 'Guardar'}
      </button>
      {!valid && <p className="error-text">Los valores deben ser mayores que 0.</p>}
    </section>
  );
}
