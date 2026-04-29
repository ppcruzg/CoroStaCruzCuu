-- CantoManager: Políticas RLS para tablas de catálogo
-- Ejecuta en el SQL Editor de Supabase

-- Permitir lectura pública de los catálogos (son datos de referencia, no privados)
CREATE POLICY "catalogos_select_todos" ON public.tiempos_liturgicos
  FOR SELECT USING (true);

CREATE POLICY "catalogos_select_todos" ON public.tipos_canto
  FOR SELECT USING (true);

CREATE POLICY "catalogos_select_todos" ON public.usos_canto
  FOR SELECT USING (true);

CREATE POLICY "catalogos_select_todos" ON public.tipos_celebracion
  FOR SELECT USING (true);

-- Solo admins pueden modificar los catálogos
CREATE POLICY "catalogos_write_admin" ON public.tiempos_liturgicos
  FOR ALL USING (public.is_admin());

CREATE POLICY "catalogos_write_admin" ON public.tipos_canto
  FOR ALL USING (public.is_admin());

CREATE POLICY "catalogos_write_admin" ON public.usos_canto
  FOR ALL USING (public.is_admin());

CREATE POLICY "catalogos_write_admin" ON public.tipos_celebracion
  FOR ALL USING (public.is_admin());

-- También habilitar lectura de sesion_cantos y canto_tiempos_liturgicos
ALTER TABLE public.sesion_cantos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canto_tiempos_liturgicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canto_usos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sesion_cantos_select" ON public.sesion_cantos
  FOR SELECT USING (true);

CREATE POLICY "canto_tiempos_select" ON public.canto_tiempos_liturgicos
  FOR SELECT USING (true);

CREATE POLICY "canto_usos_select" ON public.canto_usos
  FOR SELECT USING (true);
