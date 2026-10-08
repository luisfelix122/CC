# AGENTS.md — NutriDiario
## Proyecto
App web para registrar calorías (por foto con IA) y agua, con panel diario y resumen semanal.
Contexto: docs/proyecto.md · Glosario: docs/dominio.md · Plan: docs/plan.md

## Stack
- TypeScript 5, React 18, Vite
- Supabase (supabase-js), esquema en supabase/schema.sql
- Gemini API (visión) desde el navegador
- npm

## Comandos
- Instalar dependencias: npm install
- Levantar en desarrollo: npm run dev
- Verificar todo (obligatorio antes de terminar): make verify

## Estructura
- src/lib/: lógica pura (nutrition, stats, export) + clientes (supabase, gemini)
- src/components/: componentes visuales esqueuomórficos
- src/screens/: pantallas por caso de uso
- tests/: vitest

## Reglas
- Cada caso de uso tiene un PRP en docs/prp/. No implementes nada fuera de su alcance.
- Si make verify falla, corrige antes de declarar la tarea terminada.
- Si algo es ambiguo, pregunta en lugar de suponer.
- La lógica de cálculo va en src/lib con tests; los componentes solo presentan.

## No hacer
- Usar la secret key de Supabase en el código del cliente.
- Pedir al usuario que escriba valores nutricionales.
