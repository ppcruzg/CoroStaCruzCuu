# Propuesta: Mejora Avanzada de Búsqueda de Cantos

## Análisis del Requerimiento
El modal actual de búsqueda en `SessionDetail.tsx` es básico (solo texto). El usuario solicita dos mejoras principales:
1. **Filtro por Tipo de Canto:** Poder filtrar los resultados (ej. ver solo cantos de "Comunión" o "Entrada").
2. **Preview de Medios:** Mejorar la visibilidad y acceso a los archivos PDF y de Audio directamente desde la lista de búsqueda antes de agregarlos a la sesión, asegurando que se puedan previsualizar (abrir o reproducir) sin que se agregue el canto por accidente.

## Propuesta de Solución
1. **Filtros de Tipo:** 
   - Al abrir el modal, cargaremos la lista de `tipos_canto` desde la base de datos.
   - Agregaremos un menú desplegable (Select) o una fila de "chips" desplazables justo debajo de la barra de búsqueda para filtrar rápidamente.
   - La función `searchCantos` se actualizará para aceptar y aplicar este filtro en la consulta a Supabase (`.eq('tipo_canto_id', filtro)`).
2. **Mejora del Preview:**
   - Actualmente, usamos el componente `SongCard` estándar. Modificaremos la interacción para que, en la vista de búsqueda, haya un botón explícito y claro de **"Añadir a la sesión"** (por ejemplo, un botón azul grande o un ícono de `+` a la derecha), separando claramente la acción de "Agregar" de la acción de "Previsualizar" (tocar el ícono de PDF o Audio). Esto evita confusiones y clics accidentales.
