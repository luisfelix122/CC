import { useMemo, useState } from 'react';
import { useData } from './hooks/useData';
import { useReminders } from './hooks/useReminders';
import { aiSettings } from './lib/device';
import { dayTotals } from './lib/stats';
import { AddFood } from './screens/AddFood';
import { Dashboard } from './screens/Dashboard';
import { History } from './screens/History';
import { Settings } from './screens/Settings';
import { Water } from './screens/Water';

type Tab = 'today' | 'add' | 'water' | 'week' | 'settings';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today', icon: '🏠', label: 'Hoy' },
  { id: 'add', icon: '📷', label: 'Comida' },
  { id: 'water', icon: '💧', label: 'Agua' },
  { id: 'week', icon: '📊', label: 'Semana' },
  { id: 'settings', icon: '⚙️', label: 'Ajustes' },
];

export default function App() {
  const data = useData();
  const [tab, setTab] = useState<Tab>('today');
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const totals = useMemo(() => dayTotals(data.food, data.water), [data.food, data.water]);
  const reminder = useReminders(data.goals, totals);

  const notify = (text: string, error = false) => {
    setToast({ text, error });
    window.setTimeout(() => setToast(null), 4000);
  };
  const onError = (m: string) => notify(m, true);

  return (
    <div className="app">
      <header className="topbar">
        <h1>NutriDiario</h1>
        <span className="date">
          {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </header>

      {data.error && (
        <div className="banner error">No se pudo conectar con la base de datos: {data.error}</div>
      )}
      {reminder.message && (
        <div className="banner reminder" role="alert">
          ⏰ {reminder.message}
          <button className="icon-btn" onClick={reminder.dismiss} aria-label="Cerrar">
            ✕
          </button>
        </div>
      )}

      <main>
        {data.loading ? (
          <p className="muted center">Cargando…</p>
        ) : (
          <>
            {tab === 'today' && <Dashboard data={data} totals={totals} onError={onError} />}
            {tab === 'add' && (
              <AddFood
                hasKey={!!aiSettings.key}
                goSettings={() => setTab('settings')}
                onError={onError}
                onSaved={async () => {
                  await data.refresh();
                  notify('Comida registrada ✓');
                  setTab('today');
                }}
              />
            )}
            {tab === 'water' && <Water data={data} todayMl={totals.water_ml} onError={onError} />}
            {tab === 'week' && <History data={data} />}
            {tab === 'settings' && (
              <Settings
                data={data}
                onError={onError}
                onSaved={() => notify('Ajustes guardados ✓')}
              />
            )}
          </>
        )}
      </main>

      {toast && <div className={`toast ${toast.error ? 'error' : ''}`}>{toast.text}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
