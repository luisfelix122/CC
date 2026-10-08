# PRP CU-09 — Exportación de reportes
## Flujo principal
En Historial elige 7 o 30 días y descarga CSV (fecha, kcal, proteína, carbohidratos, grasa, agua, metas) o imprime/guarda PDF.
## Diseño
- `src/lib/export.ts#toCsv`.
## Criterios de aceptación
- [ ] La primera línea es la cabecera y hay una fila por día.
