# Propuesta: Agregar Cantos a la Sesión

## Análisis de la Situación (Fase de Exploración)
La vista `SessionDetail.tsx` actualmente consulta la base de datos (tabla `sesion_cantos`) para mostrar los cantos que pertenecen a la sesión seleccionada. Sin embargo, no existe ninguna forma en la interfaz para agregar nuevos cantos a esta lista.

## Propuesta de Solución
El objetivo es permitir al usuario buscar y seleccionar cantos para agregarlos a la celebración.

1. **Botón de Añadir:** Agregar un botón flotante (FAB) o un botón secundario al final de la lista en `SessionDetail.tsx` que diga "Añadir Canto".
2. **Modal de Búsqueda:** Al presionar el botón, se abrirá una ventana flotante (Modal) con un buscador de cantos (consultando la tabla `cantos`).
3. **Selección e Inserción:** 
   - La lista de resultados mostrará los cantos.
   - Al hacer clic en un canto, este se agregará a la sesión actual (se insertará un registro en la tabla `sesion_cantos` con el `sesion_id` actual, el `canto_id` elegido y se asignará un número de `orden` automático al final de la lista).
4. **Actualización UI:** El modal se cerrará (o permitirá seguir agregando) y la lista de cantos de la sesión se actualizará inmediatamente sin recargar.
