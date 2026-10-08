# PRP CU-08 — Recordatorios de consumo
## Flujo principal
Con recordatorios activos, cada N minutos (app abierta) muestra banner y notificación del navegador si hay permiso: agua faltante y kcal restantes.
## Diseño
- `src/hooks/useReminders.ts`, `src/lib/stats.ts#reminderMessage`.
## Criterios de aceptación
- [ ] Si la meta de agua está cumplida no se recuerda el agua.
