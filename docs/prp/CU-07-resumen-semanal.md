# PRP CU-07 — Historial y resumen semanal
## Flujo principal
Gráfico de barras de 7 días (kcal y agua) vs meta, promedios y días cumplidos.
## Diseño
- `src/lib/stats.ts#lastNDays`, `src/components/WeekChart.tsx`.
## Criterios de aceptación
- [ ] Devuelve exactamente 7 días consecutivos terminando hoy, con 0 en días sin registros.
