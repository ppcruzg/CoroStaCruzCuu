-- ============================================================
-- CantoManager: Ajuste de visibilidad de sesiones
-- Permite que los usuarios básicos vean todas las sesiones
-- ============================================================

-- 1. Actualizar política de sesiones
DROP POLICY IF EXISTS "sesiones_select" ON public.sesiones;
CREATE POLICY "sesiones_select" ON public.sesiones 
  FOR SELECT USING (true);

-- 2. (Opcional) Publicar la sesión actual que estaba oculta
UPDATE public.sesiones 
SET publicada = true 
WHERE nombre = '5TO DOMINGO ORDINARIO';
