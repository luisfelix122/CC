# PRP CU-03 — Edición o confirmación de estimación IA
## Flujo principal
1. Se muestran los ítems estimados. 2. El usuario cambia gramos, elimina o agrega ítems. 3. Se recalcula. 4. Confirma y se guarda.
## Diseño
- `src/lib/nutrition.ts#scaleItem` escala kcal y macros proporcionalmente a los gramos nuevos.
## Criterios de aceptación
- [ ] Dado un ítem de 100 g y 200 kcal, cuando paso a 150 g, entonces 300 kcal.
- [ ] Dado un ítem con 0 g original, escalar no produce NaN.
