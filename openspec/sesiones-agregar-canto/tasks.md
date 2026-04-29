# Especificación: Agregar Cantos a Sesión con Orden Litúrgico

## Corrección de Regla de Negocio
El usuario indicó que el orden de los cantos en la sesión no debe ser el orden en el que se van agregando (orden de captura), sino el orden de una misa ordinaria dominical.

## Arquitectura de la Solución
1. **Modal de Búsqueda de Cantos:**
   - Botón "Añadir Canto" en `SessionDetail.tsx`.
   - Abre un Modal con un input de texto para buscar por título.
   - Consulta a la tabla `cantos` uniendo `tipos_canto` para traer el `orden` litúrgico predeterminado del canto.
2. **Lógica de Inserción (El Orden):**
   - Cuando se hace clic en un canto para agregarlo, NO se usará el final de la lista.
   - En su lugar, el valor `orden` que se guardará en la tabla `sesion_cantos` será el `orden` oficial del `tipo_canto` de ese canto. 
   - De esta forma, si primero agregas el canto de Salida y luego el de Entrada, la base de datos les asignará sus números correspondientes y al consultar la lista, la Entrada aparecerá primero automáticamente.
3. **Consulta en SessionDetail:**
   - Para asegurarnos de que la vista siempre respeta esto, la consulta en `SessionDetail.tsx` que lee `sesion_cantos` traerá también la información de `tipo_canto` y se ordenará usando el `orden` del tipo de canto, o bien usará el `orden` insertado en `sesion_cantos`.

## Tareas (Tasks)
- [ ] 1. Crear el componente Modal de Búsqueda dentro de `SessionDetail.tsx` (estado `isSearchModalOpen`, `searchQuery`, `searchResults`).
- [ ] 2. Escribir la función `searchCantos` que consulte Supabase (`cantos` + `tipos_canto`).
- [ ] 3. Escribir la función `handleAddCantoToSession(canto)` que inserte en `sesion_cantos` usando `canto.tipo_canto.orden` como el valor para la columna `orden`.
- [ ] 4. Actualizar `fetchSessionData` para que al recargar la lista, incluya `tipo_canto` y los muestre perfectamente ordenados.
