-- ============================================================
-- CantoManager: FIX COMPLETO de permisos RLS
-- Ejecuta TODO este script en el SQL Editor de Supabase
-- ============================================================

-- --------------------------------------------------------
-- PASO 1: Fix perfiles (necesario para que is_admin() funcione)
-- --------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'perfiles' AND policyname = 'perfiles_select_propio'
  ) THEN
    CREATE POLICY "perfiles_select_propio" ON public.perfiles
      FOR SELECT USING (id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'perfiles' AND policyname = 'perfiles_update_propio'
  ) THEN
    CREATE POLICY "perfiles_update_propio" ON public.perfiles
      FOR UPDATE USING (id = auth.uid());
  END IF;
END $$;

-- --------------------------------------------------------
-- PASO 2: Asignar rol admin (CAMBIA EL EMAIL POR EL TUYO)
-- --------------------------------------------------------
UPDATE public.perfiles
SET rol = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'TU_EMAIL@ejemplo.com');

-- --------------------------------------------------------
-- PASO 3: Permisos completos para tablas de relación M:N
-- --------------------------------------------------------

-- canto_tiempos_liturgicos: lectura pública + escritura admin
DROP POLICY IF EXISTS "canto_tiempos_select" ON public.canto_tiempos_liturgicos;
CREATE POLICY "canto_tiempos_select" ON public.canto_tiempos_liturgicos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "canto_tiempos_write" ON public.canto_tiempos_liturgicos;
CREATE POLICY "canto_tiempos_write" ON public.canto_tiempos_liturgicos
  FOR ALL USING (public.is_admin());

-- canto_usos: lectura pública + escritura admin
DROP POLICY IF EXISTS "canto_usos_select" ON public.canto_usos;
CREATE POLICY "canto_usos_select" ON public.canto_usos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "canto_usos_write" ON public.canto_usos;
CREATE POLICY "canto_usos_write" ON public.canto_usos
  FOR ALL USING (public.is_admin());

-- sesion_cantos: lectura pública + escritura admin
DROP POLICY IF EXISTS "sesion_cantos_select" ON public.sesion_cantos;
CREATE POLICY "sesion_cantos_select" ON public.sesion_cantos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "sesion_cantos_write" ON public.sesion_cantos;
CREATE POLICY "sesion_cantos_write" ON public.sesion_cantos
  FOR ALL USING (public.is_admin());

-- --------------------------------------------------------
-- PASO 4: Verificar resultado final
-- --------------------------------------------------------
SELECT 
  nombre, 
  rol, 
  activo,
  (SELECT email FROM auth.users WHERE id = perfiles.id) as email
FROM public.perfiles;
