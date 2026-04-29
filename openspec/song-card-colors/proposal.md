# Propuesta: Selector de Tema Oculto

## Requerimiento
El usuario final debe poder elegir el color base de todas las tarjetas. Para mantener la interfaz limpia, la selección de colores debe estar oculta detrás de un icono de configuración.

## Propuesta de Solución
1. **Icono de Configuración:** Agregar un botón con un ícono de "engranaje" o "paleta de colores" (ej. `Settings` o `Palette` de Lucide React) en la cabecera, junto al botón de filtros.
2. **Menú Desplegable (Popover):** Al hacer clic en el ícono, se mostrará un pequeño menú flotante con las 4 opciones de colores (Blanco, Azul, Verde, Ámbar).
3. **Estado Global Local:** Se guardará la selección en el estado de `Songs.tsx` (`globalTheme`) y se pasará a todas las `<SongCard>`.
