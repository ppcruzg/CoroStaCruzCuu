-- CantoManager Seed Data
-- Ejecuta DESPUÉS de 01_init.sql

-- Tiempos Litúrgicos
INSERT INTO public.tiempos_liturgicos (codigo, nombre, color, orden) VALUES
  ('ADVIENTO',    'Adviento',           '#6B21A8', 1),
  ('NAVIDAD',     'Navidad',            '#F59E0B', 2),
  ('ORDINARIO',   'Tiempo Ordinario',   '#16A34A', 3),
  ('CUARESMA',    'Cuaresma',           '#92400E', 4),
  ('SEMANA_SANTA','Semana Santa',        '#1E3A5F', 5),
  ('PASCUA',      'Tiempo de Pascua',   '#DC2626', 6),
  ('PENTECOSTES', 'Pentecostés',        '#EF4444', 7);

-- Tipos de Canto (momentos en la misa)
INSERT INTO public.tipos_canto (codigo, nombre, es_obligatorio, orden) VALUES
  ('ENTRADA',      'Canto de Entrada',        true,  1),
  ('KYRIE',        'Kyrie / Señor ten piedad',false, 2),
  ('GLORIA',       'Gloria',                  false, 3),
  ('SALMO',        'Salmo Responsorial',       true,  4),
  ('ALELUYA',      'Aleluya / Aclamación',    true,  5),
  ('OFERTORIO',    'Canto de Ofertorio',       false, 6),
  ('SANTO',        'Santo (Sanctus)',          true,  7),
  ('CORDERO',      'Cordero de Dios (Agnus)',  true,  8),
  ('COMUNION',     'Canto de Comunión',        false, 9),
  ('ACCION_GRACIAS','Canto de Acción de Gracias', false, 10),
  ('SALIDA',       'Canto de Salida',          false, 11),
  ('MEDITACION',   'Canto de Meditación',      false, 12);

-- Usos Adicionales
INSERT INTO public.usos_canto (codigo, nombre, orden) VALUES
  ('BAUTISMO',    'Bautismo',         1),
  ('MATRIMONIO',  'Matrimonio',       2),
  ('DIFUNTOS',    'Misa de Difuntos', 3),
  ('CONFIRMACION','Confirmación',     4),
  ('ADORACION',   'Adoración',        5),
  ('ROSARIO',     'Rosario',          6);

-- Tipos de Celebración
INSERT INTO public.tipos_celebracion (codigo, nombre, orden) VALUES
  ('DOMINICAL',   'Misa Dominical',      1),
  ('DIARIA',      'Misa Diaria',         2),
  ('ESPECIAL',    'Celebración Especial',3),
  ('SACRAMENTO',  'Sacramento',          4),
  ('EXEQUIAS',    'Exequias',            5);
