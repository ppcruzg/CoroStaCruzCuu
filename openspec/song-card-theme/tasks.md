# Tareas: Tema de color para SongCard

## Especificación y Diseño
- Se añade `theme?: 'default' | 'blue' | 'green' | 'amber'` a `SongCardProps`.
- Se crea el objeto `themeClasses` que mapea cada tema con clases de Tailwind.
- Se modifica el `className` del contenedor principal usando plantillas literales (`` `...` ``) para incluir dinámicamente las clases del tema seleccionado.

## Lista de Tareas (Tasks)
- [ ] 1. Actualizar `SongCardProps` añadiendo la propiedad `theme`.
- [ ] 2. Añadir el objeto de configuración de colores (`themeClasses`) dentro del componente `SongCard`.
- [ ] 3. Aplicar las clases dinámicas al contenedor `div` principal, conservando las clases estructurales (padding, flex, etc.).
