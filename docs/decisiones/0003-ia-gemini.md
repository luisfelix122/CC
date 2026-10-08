# 0003 — Gemini con visión desde el navegador
Fecha: 2026-10-07
Estado: aceptada
## Contexto
CU-01/02 requieren analizar fotos. El usuario eligió Gemini.
## Opciones consideradas
- Edge Function de Supabase: key oculta / requiere CLI y despliegue.
- Llamada directa desde el navegador con key en Configuración: inmediato / key expuesta en el dispositivo.
## Decisión
Llamada directa a `generateContent` (modelo por defecto `gemini-2.5-flash`, editable) con salida JSON.
## Consecuencias
Mover a Edge Function antes de producción.
