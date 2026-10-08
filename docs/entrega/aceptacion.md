# Prueba de aceptación — NutriDiario
Fecha: 2026-10-07 · Entorno: http://localhost:5173 · Participantes: Cristopher (usuario)

| Caso de uso | Pasos a realizar | Resultado esperado | ¿Cumple? | Observaciones |
| --- | --- | --- | --- | --- |
| CU-01 Etiqueta | Comida → Producto → foto frontal → Analizar | Pide tabla nutricional si falta; luego solo cantidad | pendiente | Requiere API key de Gemini |
| CU-02 Plato | Comida → Plato → foto + descripción → Analizar | Ítems con gramos y kcal | pendiente | Requiere API key de Gemini |
| CU-03 Ajuste | Cambiar gramos / quitar / agregar ingrediente → Recalcular | kcal se recalculan antes de guardar | pendiente | Escalado cubierto por tests |
| CU-04 Agua | Tocar vaso / Botella | Vaso sube, se guarda en Supabase | sí | 250 + 500 = 750 ml verificado |
| CU-05 Metas | Ajustes → cambiar meta → Guardar | Panel y gráficos usan la nueva meta | sí | Meta de agua 1800 verificada |
| CU-06 Panel | Hoy | Medidor, vaso y KPIs del día | sí | |
| CU-07 Semana | Semana | 7 días, promedios, metas cumplidas | sí | |
| CU-08 Recordatorios | Ajustes → activar, 1 min | Banner + notificación | pendiente | Solo con app abierta |
| CU-09 Exportar | Semana → CSV / PDF | Descarga CSV / diálogo de impresión | pendiente | toCsv cubierto por tests |

## Problemas encontrados
- Ninguno bloqueante. Keys en el cliente: mover IA a Edge Function y agregar Supabase Auth antes de producción.
