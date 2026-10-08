# Plan — NutriDiario
Aprobado: 2026-10-07

## Tecnología
- Lenguaje / framework: TypeScript + React + Vite (ver decisiones/0001)
- Base de datos: Supabase Postgres vía supabase-js (ver decisiones/0002)
- IA: Gemini con visión desde el navegador (ver decisiones/0003)
- Despliegue: estático (Vercel/Netlify) — `npm run build`
- Verificación: eslint, prettier --check, tsc --noEmit, vitest run (`make verify`)

## Arquitectura
SPA React → supabase-js (REST + RLS) para datos; → Gemini REST para análisis de fotos.
Lógica pura en `src/lib` (cálculos, estadísticas, exportación) cubierta por tests.

## Modelo de datos
- goals: device_id (pk), kcal_goal, water_goal_ml, reminder_minutes, reminders_on
- food_entries: id, device_id, eaten_at, kind, name, description, items (jsonb), quantity_g, kcal, protein_g, carbs_g, fat_g
- water_entries: id, device_id, drank_at, ml

## Casos de uso (en orden de construcción)
| # | Caso de uso | Actor | Depende de | Hito |
| --- | --- | --- | --- | --- |
| CU-05 | Configuración de metas | Usuario | — | H1 |
| CU-04 | Registro rápido de hidratación | Usuario | CU-05 | H1 |
| CU-06 | Panel diario interactivo | Usuario | CU-04, CU-05 | H1 |
| CU-01 | Registro de calorías por etiqueta | Usuario | CU-05 | H2 |
| CU-02 | Registro de plato por foto con IA | Usuario | CU-05 | H2 |
| CU-03 | Edición/confirmación de estimación | Usuario | CU-01, CU-02 | H2 |
| CU-07 | Historial y resumen semanal | Usuario | CU-04, CU-01 | H3 |
| CU-08 | Recordatorios | Usuario | CU-05 | H3 |
| CU-09 | Exportación de reportes | Usuario | CU-07 | H3 |

## Hitos
- H1: agua + metas + panel funcionando con Supabase.
- H2: registro de comida por foto con IA.
- H3: semana, recordatorios y exportación.

## Riesgos
- La IA estima mal → CU-03 permite ajustar antes de guardar.
- Keys expuestas → aceptado para prototipo; mover IA a Edge Function antes de producción.
- Tablas no creadas → `supabase/schema.sql` + mensaje claro en la UI.
