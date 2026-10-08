# 0001 — Vite + React + TypeScript
Fecha: 2026-10-07
Estado: aceptada
## Contexto
Prototipo en ~15 min, web, con verificación automatizable.
## Opciones consideradas
- HTML+JS sin build: rápido / sin tipos ni tests cómodos.
- Next.js: SSR y API routes / más configuración.
- Vite + React + TS: arranque inmediato, tipos y vitest / sin backend propio.
## Decisión
Vite + React + TS, gráficos en SVG propio.
## Consecuencias
Fácil de desplegar estático; cualquier secreto queda en el cliente.
