# PRP CU-01 — Registro de calorías por etiqueta
## Caso de uso
- Actor: Usuario · Objetivo: registrar un producto envasado con una foto.
- Precondiciones: API key de Gemini configurada. Postcondiciones: `food_entries` con kind='label'.
### Flujo principal
1. El usuario elige "Producto" y toma/sube foto. 2. La IA indica si la foto basta para determinar el valor calórico.
3. Si basta, muestra nombre y valores por 100 g + porción sugerida. 4. El usuario solo ajusta la cantidad (g). 5. Guarda.
### Flujos alternativos
- Paso 2, si no basta → muestra qué falta (p. ej. "foto de la tabla nutricional") y permite añadir otra foto; se reanaliza con todas.
- Sin API key → aviso con enlace a Configuración. Error de red/IA → mensaje y reintento.
## Diseño
- Datos: quantity_g, kcal = kcal100 × g / 100 (`src/lib/nutrition.ts#scaleLabel`).
- Interfaz: `src/screens/AddFood.tsx`, `src/lib/gemini.ts#analyzeLabel`.
## Criterios de aceptación
- [ ] Dado 52 kcal/100 g, cuando la cantidad es 150 g, entonces kcal = 78.
- [ ] Dado que la IA responde enough=false, entonces se muestra el mensaje de lo que falta y no se puede guardar.
## Verificación
- tests/nutrition.test.ts · Prueba manual: foto de frente de un envase y luego de su tabla nutricional.
