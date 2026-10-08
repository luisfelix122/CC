# PRP CU-02 — Registro de plato por foto con IA
## Caso de uso
- Actor: Usuario · Objetivo: estimar calorías de un plato con foto + descripción.
- Postcondiciones: `food_entries` kind='plate' con items jsonb.
### Flujo principal
1. Elige "Plato", sube foto y escribe descripción. 2. La IA devuelve ítems (nombre, gramos, kcal, macros). 3. Pasa a CU-03.
### Flujos alternativos
- Sin foto → botón deshabilitado. Error IA → mensaje.
## Diseño
- `src/lib/gemini.ts#analyzePlate`, `src/lib/nutrition.ts#sumItems`.
## Criterios de aceptación
- [ ] Dados ítems de 200 y 150 kcal, el total es 350.
