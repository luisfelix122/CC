# PRP CU-05 — Configuración de metas diarias
## Flujo principal
1. En Configuración define kcal y ml diarios. 2. Se guarda en `goals` (upsert por device_id).
## Criterios de aceptación
- [ ] Sin metas guardadas se usan 2000 kcal y 2000 ml.
- [ ] Valores <= 0 no se aceptan.
