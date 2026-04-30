export type UserRole = 'basico' | 'admin';

export interface Perfil {
  id: string;
  nombre: string;
  apellido?: string;
  rol: UserRole;
  avatar_url?: string;
  activo: boolean;
  email?: string;
}

export interface Canto {
  id: string;
  titulo: string;
  autor?: string;
  tono_base?: string;
  url_pdf: string;
  url_audio?: string;
  tipo_canto_id: number;
  tipo_canto?: TipoCanto;
  tags: string[];
  notas?: string;
  activo: boolean;
  creado_en: string;
}

export interface TiempoLiturgico {
  id: number;
  codigo: string;
  nombre: string;
  color: string;
  orden: number;
}

export interface TipoCanto {
  id: number;
  codigo: string;
  nombre: string;
  es_obligatorio: boolean;
}

export interface Sesion {
  id: string;
  nombre: string;
  fecha: string;
  descripcion?: string;
  publicada: boolean;
  lista_cantos?: Canto[];
}
