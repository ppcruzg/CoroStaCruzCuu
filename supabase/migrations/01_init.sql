-- CantoManager Initial Schema
-- Based on PRD v1.1 Supabase Edition

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Profiles Table
CREATE TABLE public.perfiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre         TEXT NOT NULL,
  apellido       TEXT,
  rol            TEXT NOT NULL DEFAULT 'basico' CHECK (rol IN ('basico', 'admin')),
  avatar_url     TEXT,
  activo         BOOLEAN NOT NULL DEFAULT true,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Lookup Tables
CREATE TABLE public.tiempos_liturgicos (
  id          SERIAL PRIMARY KEY,
  codigo      TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  color       TEXT,
  descripcion TEXT,
  orden       INT NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.tipos_canto (
  id             SERIAL PRIMARY KEY,
  codigo         TEXT UNIQUE NOT NULL,
  nombre         TEXT NOT NULL,
  descripcion    TEXT,
  es_obligatorio BOOLEAN DEFAULT false,
  orden          INT NOT NULL DEFAULT 0,
  activo         BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.usos_canto (
  id          SERIAL PRIMARY KEY,
  codigo      TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  orden       INT NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.tipos_celebracion (
  id     SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  orden  INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

-- 4. Songs Table
CREATE TABLE public.cantos (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo             TEXT NOT NULL,
  autor              TEXT,
  tono_base          TEXT,
  url_pdf            TEXT,
  url_audio          TEXT,
  storage_pdf_path   TEXT,
  storage_audio_path TEXT,
  tipo_canto_id      INT REFERENCES public.tipos_canto(id),
  tags               TEXT[] DEFAULT '{}',
  notas              TEXT,
  activo             BOOLEAN NOT NULL DEFAULT true,
  creado_por         UUID REFERENCES auth.users(id),
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relationships M:N
CREATE TABLE public.canto_tiempos_liturgicos (
  canto_id            UUID REFERENCES public.cantos(id) ON DELETE CASCADE,
  tiempo_liturgico_id INT  REFERENCES public.tiempos_liturgicos(id) ON DELETE CASCADE,
  PRIMARY KEY (canto_id, tiempo_liturgico_id)
);

CREATE TABLE public.canto_usos (
  canto_id UUID REFERENCES public.cantos(id) ON DELETE CASCADE,
  uso_id   INT  REFERENCES public.usos_canto(id) ON DELETE CASCADE,
  PRIMARY KEY (canto_id, uso_id)
);

-- 5. Sessions Table
CREATE TABLE public.sesiones (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre              TEXT NOT NULL,
  fecha               DATE NOT NULL,
  descripcion         TEXT,
  tipo_celebracion_id INT REFERENCES public.tipos_celebracion(id),
  tiempo_liturgico_id INT REFERENCES public.tiempos_liturgicos(id),
  ministre_responsable TEXT,
  notas_internas      TEXT,
  publicada           BOOLEAN NOT NULL DEFAULT false,
  creado_por          UUID REFERENCES auth.users(id),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sesion_cantos (
  id        SERIAL PRIMARY KEY,
  sesion_id UUID REFERENCES public.sesiones(id) ON DELETE CASCADE,
  canto_id  UUID REFERENCES public.cantos(id) ON DELETE RESTRICT,
  orden     INT NOT NULL DEFAULT 0,
  notas     TEXT,
  UNIQUE (sesion_id, orden)
);

-- 6. Row Level Security (RLS)
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cantos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol = 'admin' AND activo = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies for Cantos
CREATE POLICY "cantos_select_public" ON public.cantos FOR SELECT USING (activo = true);
CREATE POLICY "cantos_write_admin" ON public.cantos FOR ALL USING (public.is_admin());

-- Policies for Sessions
CREATE POLICY "sesiones_select" ON public.sesiones FOR SELECT USING (publicada = true OR public.is_admin());
CREATE POLICY "sesiones_write_admin" ON public.sesiones FOR ALL USING (public.is_admin());

-- 7. Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, rol)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email), 'basico');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
