-- CantoManager: Fix RLS perfiles + asignar admin
-- Ejecuta en el SQL Editor de Supabase

-- 1. Política para que cada usuario pueda leer su propio perfil
--    (necesario para que is_admin() funcione correctamente)
CREATE POLICY "perfiles_select_propio" ON public.perfiles
  FOR SELECT USING (id = auth.uid());

-- 2. Política para que el usuario pueda actualizar su propio perfil
CREATE POLICY "perfiles_update_propio" ON public.perfiles
  FOR UPDATE USING (id = auth.uid());

-- 3. Política para que admins puedan ver todos los perfiles
CREATE POLICY "perfiles_select_admin" ON public.perfiles
  FOR ALL USING (public.is_admin());

-- ============================================================
-- 4. IMPORTANTE: Asignar rol admin a tu usuario
--    Reemplaza el email con el tuyo
-- ============================================================
UPDATE public.perfiles
SET rol = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'TU_EMAIL_AQUI@ejemplo.com'
);

-- Verifica que quedó correctamente:
SELECT id, nombre, rol FROM public.perfiles;
