# Especificación: Creación de Sesiones

## Objetivo
Implementar la funcionalidad para que el botón "Plus" en la pantalla de `Sessions.tsx` abra un formulario que permita registrar una nueva sesión en la base de datos de Supabase.

## Arquitectura y Diseño (UI/UX)
1. **Modal de Creación:** Usaremos un componente Modal (o un diálogo flotante) dentro de `Sessions.tsx` para no sacar al usuario de la pantalla.
2. **Campos del Formulario:**
   - **Nombre:** (Texto, Requerido) Ej. "Misa de Acción de Gracias".
   - **Fecha:** (Fecha, Requerida) Selector de fecha.
3. **Valores por defecto:**
   - La nueva sesión se guardará como borrador (`publicada: false`).
   - No tendrá cantos asignados todavía.

## Lista de Tareas (Tasks)
- [ ] 1. Crear los estados en `Sessions.tsx` para controlar el modal (`isCreateModalOpen`) y el estado del formulario (nombre, fecha, cargando).
- [ ] 2. Añadir el marcado JSX del Modal (fondo oscuro, ventana centrada, inputs de texto y fecha, botones cancelar/guardar).
- [ ] 3. Implementar la función `handleCreateSession` que inserte los datos en la tabla `sesiones` de Supabase.
- [ ] 4. Actualizar la lista local (`setSessions`) inmediatamente después de guardar para que aparezca sin recargar la página.
- [ ] 5. Conectar el botón `<Plus />` existente para que abra este modal.
