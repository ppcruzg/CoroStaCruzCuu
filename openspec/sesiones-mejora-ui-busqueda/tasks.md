# Especificación: Mejora de UI en Búsqueda de Sesión

## Análisis del Requerimiento
1. **Espacio Vertical:** La tarjeta actual en los resultados de búsqueda (`SongCard`) ocupa demasiado espacio. El usuario quiere un diseño más compacto ("lista") para ver más cantos a la vez.
2. **Filtros Avanzados:** El usuario quiere que los filtros sean similares a la pantalla de Administración (`Songs.tsx`), es decir, un menú/panel de filtros con opciones estructuradas en lugar de una simple fila de chips.
3. **Previews:** Los botones de PDF y Audio deben integrarse en esta vista compacta.

## Arquitectura de la Solución
1. **Vista Compacta (List Item):**
   - En lugar de usar `SongCard`, crearemos una fila compacta `div` que muestre: Título, Tipo de Canto (como un mini-badge), íconos de PDF/Audio, y un botón cuadrado de `+` a la derecha.
   - Esto reducirá la altura de cada resultado de ~120px a ~60px, duplicando la cantidad de cantos visibles.
2. **Filtros (UI Similar a Admin):**
   - Agregaremos un botón con el ícono `Filter` al lado de la barra de búsqueda.
   - Al presionarlo, se desplegará una sección de filtros dentro del modal (similar al modal de `Songs.tsx`) mostrando las grillas de "Tiempo Litúrgico" y "Momento de la Misa".
   - Al seleccionar los filtros, la consulta a Supabase aplicará ambas condiciones.

## Lista de Tareas
- [ ] 1. Cargar `tiempos_liturgicos` en `SessionDetail.tsx`.
- [ ] 2. Agregar estado para `showFilters`, `selectedTiempo`, `selectedMomento`.
- [ ] 3. Actualizar la función `searchCantos` para soportar ambos filtros y buscar por título.
- [ ] 4. Rediseñar el header del Modal de Búsqueda para incluir el botón de Filtros y su panel expandible.
- [ ] 5. Rediseñar el ítem de resultado de búsqueda para que sea compacto e incluya los botones de Preview y Añadir.
