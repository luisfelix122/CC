# Glosario del dominio
| Término | Definición | Nombre en el código | No confundir con |
| --- | --- | --- | --- |
| Registro de comida | Algo comido con sus kcal y macros | `FoodEntry` / `food_entries` | Ítem |
| Ítem | Ingrediente reconocido en un plato | `FoodItem` | Registro de comida |
| Producto | Alimento envasado con etiqueta nutricional (CU-01) | `kind = 'label'` | Plato |
| Plato | Comida preparada fotografiada (CU-02) | `kind = 'plate'` | Producto |
| Estimación | Resultado de la IA antes de confirmar | `Estimate` | Registro |
| Registro de agua | Cantidad de agua bebida | `WaterEntry` / `water_entries` | — |
| Meta diaria | Objetivo de kcal y ml de agua | `Goals` / `goals` | — |
| Dispositivo | Identidad anónima del usuario | `device_id` | Usuario autenticado |

## Estados
- Estimación: foto subida → analizada (suficiente | falta info) → ajustada → confirmada (se guarda como Registro).

## Reglas del negocio
- kcal de un producto = kcal por 100 g × cantidad (g) / 100.
- Ajustar los gramos de un ítem escala sus kcal y macros proporcionalmente.
- El usuario no ingresa valores nutricionales manualmente; solo cantidades.
- El "día" es el día calendario local del dispositivo.
