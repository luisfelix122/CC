# 0002 — Identidad anónima por device_id
Fecha: 2026-10-07
Estado: aceptada
## Contexto
Un solo usuario de prueba; login agrega fricción y tiempo.
## Opciones consideradas
- Supabase Auth (email): seguro / más pantallas y configuración.
- Auth anónima de Supabase: segura / hay que habilitarla en el dashboard.
- device_id en localStorage + RLS abierta a anon: inmediato / cualquiera con la key puede leer datos.
## Decisión
device_id en localStorage. Solo se usa la publishable key en el front.
## Consecuencias
No apto para producción; migrar a Supabase Auth y RLS por auth.uid().
