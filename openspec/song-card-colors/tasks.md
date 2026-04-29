# Tareas: Selector de Tema Global

## Diseño Técnico
1. **Estado:**
   - `globalTheme`: Estado string inicializado en 'default'.
   - `showThemeMenu`: Estado booleano inicializado en `false`.
2. **Importaciones:**
   - Importar `Palette` de `lucide-react`.
   - Importar `SongCardTheme` de `../components/songs/SongCard`.
3. **UI - Botón:**
   - Añadir un botón con el ícono `Palette` junto al botón de Filtros.
4. **UI - Menú Desplegable:**
   - Renderizar un menú con 4 opciones (Blanco, Azul, Verde, Ámbar) posicionado absolutamente debajo del botón de la paleta.
5. **Aplicación:**
   - En la iteración `filteredSongs.map`, pasar `theme={globalTheme}` a `<SongCard>`.

## Tareas (Tasks)
- [ ] 1. Añadir importaciones requeridas (`Palette`, `SongCardTheme`).
- [ ] 2. Añadir estados `globalTheme` y `showThemeMenu` al componente `Songs`.
- [ ] 3. Actualizar la cabecera insertando el botón `Palette` y su menú desplegable.
- [ ] 4. Reemplazar la asignación de colores actual (`themes[index % 4]`) por `globalTheme`.
