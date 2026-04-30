-- ============================================================
-- CantoManager: RPCs para Administración Segura de Usuarios
-- Ejecuta TODO este script en el SQL Editor de Supabase
-- ============================================================

-- 1. Activar extensión pgcrypto (necesaria para encriptar contraseñas)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Función para obtener los correos de los usuarios (Solo Admins)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (user_id UUID, user_email VARCHAR)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si el usuario actual es administrador
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: Se requieren privilegios de administrador.';
  END IF;
  
  -- Retornar la lista de IDs y correos de la tabla protegida auth.users
  RETURN QUERY SELECT id, email::VARCHAR FROM auth.users;
END;
$$;

-- 3. Función para actualizar correo y contraseña de un usuario (Solo Admins)
CREATE OR REPLACE FUNCTION public.admin_update_user(
  target_user_id UUID, 
  new_email TEXT DEFAULT NULL, 
  new_password TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si el usuario actual es administrador
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acceso denegado: Se requieren privilegios de administrador.';
  END IF;

  -- Actualizar el correo si se proporcionó uno
  IF new_email IS NOT NULL AND new_email != '' THEN
    UPDATE auth.users 
    SET email = new_email, email_confirmed_at = now() 
    WHERE id = target_user_id;
  END IF;

  -- Actualizar la contraseña si se proporcionó una
  IF new_password IS NOT NULL AND new_password != '' THEN
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf')) 
    WHERE id = target_user_id;
  END IF;
END;
$$;
