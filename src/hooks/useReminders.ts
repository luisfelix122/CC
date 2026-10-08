import { useEffect, useState } from 'react';
import { reminderMessage } from '../lib/stats';
import type { DayTotals, Goals } from '../lib/types';

export function useReminders(goals: Goals, totals: DayTotals) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!goals.reminders_on) return;
    const tick = () => {
      const msg = reminderMessage(totals, goals);
      setMessage(msg);
      if (msg && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('NutriDiario', { body: msg });
      }
    };
    const id = window.setInterval(tick, goals.reminder_minutes * 60_000);
    return () => window.clearInterval(id);
  }, [goals, totals]);

  return { message, dismiss: () => setMessage(null) };
}
