# NutriDiario

## Problema
> Contar calorías y agua a mano es tedioso: hay que buscar valores nutricionales y sumar. Quien quiere cuidar su dieta abandona el registro a los pocos días.

## Usuarios
| Usuario / rol | Qué necesita hacer |
| --- | --- |
| Usuario | Registrar a diario comida (por foto) y agua, y ver su progreso diario y semanal |

## Cómo trabajan hoy
1. Busca el valor calórico en la etiqueta o en internet.
2. Lo anota en papel o en una app genérica con formularios largos.
3. No registra el agua o lo olvida.

## Objetivo del producto
> Registrar calorías con una foto y el agua con un toque, viendo el progreso del día y de la semana.

## Alcance
- Incluye: CU-01 a CU-09 (ver docs/plan.md).
- No incluye: login/multiusuario, app nativa, recetas, sincronización con wearables.

## Restricciones
- Plazo: prototipo en ~15 minutos.
- Presupuesto: capas gratuitas (Supabase, Gemini).
- Técnicas: keys en el cliente aceptadas solo para prueba.
- Dispositivos: navegador móvil y escritorio.

## Cómo sabremos que funciona
- Registrar una comida por foto en menos de 30 s sin escribir valores nutricionales.
- Registrar un vaso de agua en 1 toque.
- Ver KPIs del día y gráfico de 7 días.

## Preguntas abiertas
- Boceto de inspiración no adjuntado: se usa estilo esqueuomórfico propio.
