# PRP CU-06 — Panel diario interactivo
## Flujo principal
Muestra medidor analógico de kcal, vaso con nivel de líquido, KPIs (kcal consumidas/restantes, ml y % de meta, macros) y lista de hoy.
## Diseño
- `src/lib/stats.ts#dayTotals`, `src/components/Gauge.tsx`, `src/components/WaterGlass.tsx`.
## Criterios de aceptación
- [ ] Solo cuenta registros del día local actual.
- [ ] Restantes nunca negativos; el exceso se indica.
