# Especificación: Modo En Vivo (Live Mode)

## Objetivo
Implementar la "Vista de Presentación" de una sesión, permitiendo al usuario visualizar los cantos (PDFs) en pantalla completa de forma secuencial, facilitando la ejecución de la celebración sin distracciones.

## Arquitectura y Navegación
1. **Ruta Nueva:** `/sesiones/:id/live`.
2. **Activación:** Se enlazará el botón "Iniciar Modo En Vivo" de `SessionDetail.tsx` hacia esta nueva ruta.
3. **Layout "Fullscreen":**
   - El componente `LiveSession.tsx` usará `fixed inset-0 z-[100] bg-black` para sobreponerse a cualquier barra de navegación global de la app.

## Interfaz del Modo En Vivo
- **Header Top (Oscuro):**
  - Botón (X) Cerrar (regresa a SessionDetail).
  - Título central indicando el avance: *Canto 1 de 5 - Entrada*.
- **Body (Contenido Principal):**
  - Un `iframe` a pantalla completa cargando el `url_pdf` del canto actual.
  - Si el canto no tiene PDF, se muestra un mensaje centrado ("Este canto no tiene PDF asignado").
- **Footer Bottom (Navegación Oscura):**
  - Botón grande **"Anterior"** (desactivado si es el primer canto).
  - Título del canto actual en texto grande para confirmación visual.
  - Botón grande **"Siguiente"** (desactivado si es el último canto).

## Lista de Tareas
- [ ] 1. Crear el archivo `src/pages/LiveSession.tsx` con toda la UI y lógica de navegación.
- [ ] 2. Añadir la ruta `/sesiones/:id/live` en `App.tsx`.
- [ ] 3. Actualizar `SessionDetail.tsx` para que el botón "Iniciar Modo En Vivo" navegue a la nueva ruta.
