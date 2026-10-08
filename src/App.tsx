import { useMemo, useState, type ReactNode } from 'react';
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

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'today',
    label: 'Hoy',
    icon: icon(<path d="M3 11 12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />),
  },
  {
    id: 'add',
    label: 'Comida',
    icon: icon(
      <>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </>,
    ),
  },
  {
    id: 'water',
    label: 'Agua',
    icon: icon(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />),
  },
  { id: 'week', label: 'Semana', icon: icon(<path d="M5 20V11M12 20V5M19 20v-6" />) },
  {
    id: 'settings',
    label: 'Ajustes',
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>,
    ),
  },
];

const TITLES: Record<Tab, string> = {
  today: 'Hola 👋',
  add: 'Registrar comida',
  water: 'Hidratación',
  week: 'Tu semana',
  settings: 'Metas y avisos',
};

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
        <div>
          <h1>{TITLES[tab]}</h1>
          <p className="date">
            {new Date().toLocaleDateString('es', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <button
          className="round-btn on-ink header-btn"
          onClick={() => setTab('settings')}
          aria-label="Metas y recordatorios"
        >
          {icon(
            <>
              <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </>,
          )}
        </button>
      </header>

      {data.error && (
        <div className="banner error">No se pudo conectar con la base de datos: {data.error}</div>
      )}
      {reminder.message && (
        <div className="banner reminder" role="alert">
          {reminder.message}
          <button className="round-btn ghost" onClick={reminder.dismiss} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}

      <main>
        {data.loading ? (
          <p className="muted center">Cargando tu día…</p>
        ) : (
          <>
            {tab === 'today' && (
              <Dashboard
                data={data}
                totals={totals}
                onError={onError}
                onAddFood={() => setTab('add')}
              />
            )}
            {tab === 'add' && (
              <AddFood
                hasKey={!!aiSettings.key}
                onError={onError}
                onSaved={async () => {
                  await data.refresh();
                  notify('Comida registrada');
                  setTab('today');
                }}
              />
            )}
            {tab === 'water' && <Water data={data} todayMl={totals.water_ml} onError={onError} />}
            {tab === 'week' && <History data={data} />}
            {tab === 'settings' && (
              <Settings data={data} onError={onError} onSaved={() => notify('Metas guardadas')} />
            )}
          </>
        )}
      </main>

      {toast && (
        <div className={`toast ${toast.error ? 'error' : ''}`} role="status">
          {toast.text}
        </div>
      )}

      <nav className="tabbar" aria-label="Secciones">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            aria-label={t.label}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
