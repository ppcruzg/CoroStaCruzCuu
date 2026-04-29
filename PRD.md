# CantoManager — Product Requirements Document

> **Versión:** 1.1 – Supabase Edition  
> **Fecha:** Abril 2026  
> **Estado:** Borrador para revisión  
> **Stack BD:** Supabase (PostgreSQL + Auth + Storage + Realtime)  
> **Plataforma:** Web App Mobile-First (Fase 1) → App Móvil Nativa (Fase 2)

---

## Tabla de contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Contexto y Problemática](#2-contexto-y-problemática)
3. [Objetivos del Producto](#3-objetivos-del-producto)
4. [Usuarios y Roles](#4-usuarios-y-roles)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Requerimientos Funcionales](#6-requerimientos-funcionales)
7. [Funcionalidades Enriquecidas](#7-funcionalidades-enriquecidas)
8. [Requerimientos No Funcionales](#8-requerimientos-no-funcionales)
9. [Arquitectura con Supabase](#9-arquitectura-con-supabase)
10. [Esquema de Base de Datos](#10-esquema-de-base-de-datos-postgresql--supabase)
11. [Row Level Security (RLS)](#11-row-level-security-rls)
12. [Supabase Storage](#12-supabase-storage)
13. [Realtime](#13-realtime-con-supabase)
14. [SDK y Configuración del Cliente](#14-sdk-y-configuración-del-cliente)
15. [Supabase CLI y Migraciones](#15-supabase-cli-y-migraciones)
16. [Stack Tecnológico](#16-stack-tecnológico)
17. [Plan de Configuración Inicial](#17-plan-de-configuración-inicial-de-supabase)
18. [Límites del Plan Gratuito](#18-límites-del-plan-gratuito-y-costos)
19. [Seguridad](#19-consideraciones-de-seguridad)
20. [Plan de Fases y Roadmap](#20-plan-de-fases-y-roadmap)
21. [Criterios de Aceptación](#21-criterios-de-aceptación)
22. [Glosario](#22-glosario)

---

## 1. Resumen Ejecutivo

**CantoManager** es una plataforma web mobile-first para centralizar, organizar y facilitar el acceso al repertorio de cantos litúrgicos de una comunidad parroquial o grupo de canto.

El sistema permite:
- Administrar cantos individuales con sus metadatos litúrgicos y recursos multimedia (PDF, audio).
- Agruparlos en **sesiones de canto** para fechas específicas.
- Gestionar los catálogos del calendario litúrgico católico.
- Controlar el acceso mediante dos roles: **Administrador** y **Usuario Básico**.

**Supabase** es la plataforma de backend-as-a-service (BaaS) elegida, aportando PostgreSQL gestionado, autenticación integrada, Row Level Security (RLS), Storage y Realtime mediante WebSockets — reduciendo drásticamente el tiempo de desarrollo y eliminando la necesidad de gestionar servidores propios.

La arquitectura es diseñada desde la Fase 1 con portabilidad total a una **aplicación móvil nativa** en la Fase 2, usando el mismo SDK de Supabase.

---

## 2. Contexto y Problemática

### 2.1 Problemática actual

Las comunidades parroquiales con grupos de canto organizados enfrentan los siguientes desafíos:

- El repertorio está disperso en drives, grupos de WhatsApp, correos o carpetas físicas, sin un punto centralizado.
- No existe forma estructurada de planificar sesiones para las diferentes celebraciones litúrgicas.
- Los ministros de música no pueden buscar cantos eficientemente por tipo, tiempo litúrgico o uso.
- Los cantores reciben listas por mensajería informal, sin acceso garantizado a letras o audios.
- No hay trazabilidad de qué cantos se usaron en qué fechas, dificultando la planificación.

### 2.2 Oportunidad

Un sistema centralizado, accesible desde el celular y bien estructurado mejora la coordinación del equipo de canto, la calidad de las celebraciones litúrgicas y la experiencia de todos los participantes.

---

## 3. Objetivos del Producto

### 3.1 Objetivo general

Desarrollar una aplicación web mobile-first que permita administrar el repositorio de cantos litúrgicos y las sesiones de canto, con control de acceso por roles, integración con repositorios externos de archivos (Google Drive) y Supabase como plataforma de datos.

### 3.2 Objetivos específicos

1. Centralizar el catálogo de cantos con sus metadatos litúrgicos, recursos PDF y audio.
2. Facilitar la creación y gestión de sesiones de canto para fechas específicas.
3. Proveer una experiencia de consulta rápida y optimizada para teléfonos celulares.
4. Controlar el acceso mediante roles: **Administrador** y **Usuario Básico**.
5. Diseñar la arquitectura con API REST preparada para app móvil nativa (Fase 2).
6. Permitir búsqueda eficiente de cantos y sesiones con filtros múltiples.
7. Integrar visualización de PDF y reproducción de audio directamente en la plataforma.

---

## 4. Usuarios y Roles

| Rol | Descripción | Permisos principales |
|-----|-------------|----------------------|
| **Administrador** | Coordinador de canto, director de pastoral o encargado de liturgia | CRUD completo: cantos, sesiones, tipos, usos. Gestión de usuarios |
| **Usuario Básico** | Cantores, músicos, fieles participantes | Consultar cantos y sesiones, ver PDF, escuchar audio. Sin edición |
| **Super Admin** *(futuro)* | Administrador técnico del sistema | Acceso total incluyendo configuración del sistema y logs |

> **Implementación en Supabase:** el rol se almacena en la tabla `perfiles.rol` (`'basico'` | `'admin'`). Row Level Security aplica los permisos directamente en la base de datos de forma independiente al frontend.

---

## 5. Modelo de Datos

### 5.1 Entidad: Canto

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID | ✅ | Identificador único |
| `titulo` | String (200) | ✅ | Nombre oficial del canto |
| `autor` | String (150) | ❌ | Autor de la letra y/o música |
| `tiempo_liturgico` | Catálogo M:N | ✅ | Tiempos del año litúrgico asociados |
| `tipo_canto_id` | FK → tipos_canto | ✅ | Momento de la misa en que se usa |
| `uso_canto` | Catálogo M:N | ❌ | Tipo de celebración adicional |
| `url_pdf` | URL | ✅ | Enlace al PDF (Google Drive u otro) |
| `url_audio` | URL | ❌ | Enlace al audio de referencia |
| `storage_pdf_path` | Text | ❌ | Path en Supabase Storage (Fase 1.5) |
| `storage_audio_path` | Text | ❌ | Path en Supabase Storage (Fase 1.5) |
| `tono_base` | String (10) | ❌ | Tonalidad musical (Do Mayor, La m…) |
| `tags` | String[] | ❌ | Etiquetas para búsqueda libre |
| `notas` | Text | ❌ | Observaciones internas del coordinador |
| `activo` | Boolean | ✅ | Si el canto está vigente |
| `creado_por` | UUID FK | ✅ | Usuario que lo registró |
| `creado_en` | Timestamp | ✅ | Fecha de registro |
| `actualizado_en` | Timestamp | ✅ | Última modificación |

### 5.2 Entidad: Sesión de Canto

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID | ✅ | Identificador único |
| `nombre` | String (200) | ✅ | Nombre descriptivo |
| `fecha` | Date | ✅ | Fecha de la celebración |
| `descripcion` | Text | ❌ | Contexto adicional |
| `tipo_celebracion_id` | FK | ✅ | Misa, Hora Santa, Retiro… |
| `tiempo_liturgico_id` | FK | ❌ | Tiempo litúrgico predominante |
| `lista_cantos` | Relación ordenada | ✅ | Cantos en orden de la celebración |
| `ministro_responsable` | Text | ❌ | Coordinador a cargo |
| `notas_internas` | Text | ❌ | Notas privadas del administrador |
| `publicada` | Boolean | ✅ | Visibilidad para usuarios básicos |
| `creado_por` | UUID FK | ✅ | Usuario que la creó |
| `creado_en` | Timestamp | ✅ | Fecha de creación |

### 5.3 Catálogos del sistema

#### Tiempos Litúrgicos

| Código | Tiempo Litúrgico | Color Litúrgico | Notas |
|--------|-----------------|-----------------|-------|
| `ADV` | Adviento | Morado / Rosa (3er domingo) | 4 semanas antes de Navidad |
| `NAV` | Navidad | Blanco / Dorado | 25 dic – Bautismo del Señor |
| `ORD-1` | Tiempo Ordinario I | Verde | Entre Navidad y Cuaresma |
| `CUA` | Cuaresma | Morado | Miércoles de Ceniza – Jueves Santo |
| `SEM-SAN` | Semana Santa / Triduo | Rojo / Morado | Domingo de Ramos – Sábado Santo |
| `PAS` | Pascua | Blanco / Dorado | Vigilia Pascual – Pentecostés |
| `PEN` | Pentecostés | Rojo | Domingo de Pentecostés |
| `ORD-2` | Tiempo Ordinario II | Verde | Después de Pentecostés hasta Adviento |
| `ESP` | Solemnidades y Fiestas | Variable | Corpus Christi, Asunción… |
| `PROP` | Propio del Santo / Beato | Variable | Fiestas patronales locales |

#### Tipos de Canto (Momentos de la Misa)

| Código | Tipo | Momento / Contexto | Obligatorio |
|--------|------|-------------------|-------------|
| `ENT` | Canto de Entrada | Inicio, procesión de entrada | ✅ Misa |
| `ACT-PEN` | Acto Penitencial / Kyrie | Señor ten piedad | ✅ Misa |
| `GLO` | Gloria | Himno de alabanza dominical | ✅ Domingos/fiestas |
| `SAL` | Salmo Responsorial | Entre lecturas | ✅ Misa |
| `ACL` | Aclamación al Evangelio / Aleluya | Antes del Evangelio | ✅ Misa |
| `CRE` | Credo / Profesión de Fe | Después del Evangelio (cantado) | ❌ Opcional |
| `OFE` | Ofertorio | Presentación de ofrendas | ✅ Misa |
| `SAN` | Santo (Sanctus) | Inicio de la Plegaria Eucarística | ✅ Misa |
| `ANM` | Anamnesis / Memorial del Señor | Dentro de la Plegaria | ✅ Misa |
| `PAD` | Padre Nuestro | Antes de la Comunión | ❌ Opcional |
| `AGN` | Cordero de Dios (Agnus Dei) | Fracción del Pan | ✅ Misa |
| `COM` | Comunión | Durante la distribución | ✅ Misa |
| `ACG` | Acción de Gracias | Después de la Comunión | ❌ Opcional |
| `SAL-MIS` | Canto de Salida / Envío | Al final de la celebración | ✅ Misa |
| `ALA` | Alabanza / Adoración | Hora Santa, adoración eucarística | Especiales |
| `MAR` | Mariano | Cantos a la Virgen María | Marianas |
| `SAN-ESP` | Al Espíritu Santo | Pentecostés, confirmaciones | Especiales |
| `PEN-LIT` | Penitencial | Retiros, confesiones comunitarias | Especiales |
| `FUN` | Exequias / Funerales | Celebraciones fúnebres | Exequias |
| `MAT` | Laudes / Maitines | Liturgia de las Horas – mañana | Lit. Horas |
| `VES` | Vísperas | Liturgia de las Horas – tarde | Lit. Horas |
| `INF` | Infantil / Niños | Misas con niños, catequesis | Infantiles |

#### Usos del Canto

| Código | Uso | Descripción |
|--------|-----|-------------|
| `HS` | Hora Santa | Adoración eucarística |
| `RET` | Retiro Espiritual | Jornadas de oración y reflexión |
| `CON` | Convivencia / Encuentro | Reuniones comunitarias |
| `JUV` | Juvenil | Celebraciones con jóvenes |
| `INF` | Infantil | Misas y catequesis con niños |
| `MAT` | Matrimonios | Bodas y preparación matrimonial |
| `BAU` | Bautizos | Celebraciones bautismales |
| `QUI` | Quinceañeras | Misa de quinceaños |
| `GRA` | Graduaciones | Misas de graduación |
| `MIS-ESP` | Misas Especiales | Votivas, rogativas, acción de gracias |
| `PRO` | Procesiones | Corpus Christi, Semana Santa, patronales |
| `CAT` | Catequesis | Primera comunión, confirmación |

#### Tipos de Celebración (para Sesiones)

| Código | Tipo |
|--------|------|
| `MISA-DOM` | Misa Dominical |
| `MISA-ENTRE` | Misa entre semana |
| `MISA-ESP` | Misa especial / solemnidad |
| `HORA-SANTA` | Hora Santa |
| `SAB-COM` | Sábado de Comunión |
| `VIE-HS` | Viernes de Hora Santa |
| `RETIRO` | Retiro espiritual |
| `PROCESION` | Procesión |
| `CATEQUESIS` | Sesión de catequesis |
| `OTRO` | Otro (descripción libre) |

---

## 6. Requerimientos Funcionales

### 6.1 Módulo de Cantos

#### RF-01: Gestión de Cantos (Admin)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-01.1 | Crear un canto con todos sus campos | 🔴 Alta |
| RF-01.2 | Editar cualquier campo de un canto existente | 🔴 Alta |
| RF-01.3 | Desactivar/activar un canto (soft delete) | 🔴 Alta |
| RF-01.4 | Asignar múltiples tiempos litúrgicos | 🔴 Alta |
| RF-01.5 | Asignar múltiples usos | 🟡 Media |
| RF-01.6 | Vista previa del PDF desde el formulario | 🔴 Alta |
| RF-01.7 | Reproducción del audio desde el formulario | 🔴 Alta |
| RF-01.8 | Duplicar un canto como base para uno nuevo | 🟢 Baja |

#### RF-02: Consulta de Cantos (Todos los Usuarios)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-02.1 | Listado paginado con búsqueda por título | 🔴 Alta |
| RF-02.2 | Filtrar por tipo de canto | 🔴 Alta |
| RF-02.3 | Filtrar por tiempo litúrgico | 🔴 Alta |
| RF-02.4 | Filtrar por uso | 🟡 Media |
| RF-02.5 | Búsqueda por tags/etiquetas | 🟡 Media |
| RF-02.6 | Ver PDF del canto (visor integrado o nueva pestaña) | 🔴 Alta |
| RF-02.7 | Reproducir audio del canto | 🔴 Alta |
| RF-02.8 | Ver ficha completa del canto | 🔴 Alta |
| RF-02.9 | Íconos indicando disponibilidad de PDF y audio | 🔴 Alta |

### 6.2 Módulo de Sesiones de Canto

#### RF-03: Gestión de Sesiones (Admin)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-03.1 | Crear sesión con nombre, fecha, tipo y descripción | 🔴 Alta |
| RF-03.2 | Buscar y agregar cantos a una sesión | 🔴 Alta |
| RF-03.3 | Reordenar cantos dentro de una sesión (drag & drop) | 🔴 Alta |
| RF-03.4 | Eliminar un canto de la sesión sin eliminarlo del catálogo | 🔴 Alta |
| RF-03.5 | Publicar / despublicar una sesión | 🔴 Alta |
| RF-03.6 | Clonar una sesión anterior | 🟡 Media |
| RF-03.7 | Agregar notas por canto dentro de la sesión | 🟡 Media |
| RF-03.8 | Asignar tiempo litúrgico a la sesión | 🟡 Media |

#### RF-04: Consulta de Sesiones (Todos los Usuarios)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-04.1 | Listado de sesiones ordenado por fecha (más recientes primero) | 🔴 Alta |
| RF-04.2 | Búsqueda por nombre, fecha o tipo de celebración | 🔴 Alta |
| RF-04.3 | Ver detalle de una sesión con la lista ordenada de cantos | 🔴 Alta |
| RF-04.4 | Abrir PDF del canto desde la sesión con un toque | 🔴 Alta |
| RF-04.5 | Reproducir audio del canto desde la sesión | 🔴 Alta |
| RF-04.6 | Íconos de disponibilidad de PDF y audio en cada canto | 🔴 Alta |
| RF-04.7 | Filtrar sesiones por rango de fechas | 🟡 Media |
| RF-04.8 | Filtrar sesiones por tipo de celebración | 🟡 Media |
| RF-04.9 | Vista rápida de sesiones próximas (7 y 30 días) | 🔴 Alta |

### 6.3 Módulo de Catálogos (Admin)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-05.1 | CRUD de Tipos de Canto | 🔴 Alta |
| RF-05.2 | CRUD de Tiempos Litúrgicos | 🔴 Alta |
| RF-05.3 | CRUD de Usos del Canto | 🔴 Alta |
| RF-05.4 | CRUD de Tipos de Celebración | 🔴 Alta |
| RF-05.5 | Activar/desactivar ítems de catálogo | 🔴 Alta |
| RF-05.6 | Reordenar ítems de catálogo | 🟡 Media |

### 6.4 Módulo de Usuarios y Seguridad

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-06.1 | Registro de usuarios con email y contraseña | 🔴 Alta |
| RF-06.2 | Login con email/contraseña (Supabase Auth) | 🔴 Alta |
| RF-06.3 | Asignación de rol por administrador | 🔴 Alta |
| RF-06.4 | Recuperación de contraseña por correo | 🔴 Alta |
| RF-06.5 | Listado y gestión de usuarios | 🔴 Alta |
| RF-06.6 | Invitación a nuevos usuarios por email | 🟡 Media |
| RF-06.7 | Sesión persistente con refresh token automático | 🔴 Alta |

---

## 7. Funcionalidades Enriquecidas

### 7.1 Dashboard inteligente

- Próxima sesión programada con cuenta regresiva de días.
- Acceso rápido a la última sesión consultada.
- Cantos más utilizados en los últimos 30/90 días.
- Resumen del catálogo: total de cantos, sesiones del mes, cantos sin audio.
- Acceso directo a cantos del tiempo litúrgico actual (detección automática del calendario).

### 7.2 Modo Presentación / Vista de Sesión en Vivo

- Vista pantalla completa optimizada para tablet o proyector durante la celebración.
- Navegación entre cantos con gestos (swipe) en móvil.
- Visualización del PDF canto a canto sin salir de la sesión.
- Control de avance del canto actual para el director.

### 7.3 Historial y Estadísticas

- Historial de sesiones por rango de fechas y tipo de celebración.
- Reporte de cantos usados con frecuencia (top 20 del año).
- Cantos no usados en más de 6 meses (catálogo en desuso).
- Distribución de cantos por tiempo litúrgico y tipo.
- Exportación de reportes en PDF o Excel.

### 7.4 Integración con Google Drive

- Selector de archivos conectado a Google Drive (sin copiar URLs manualmente).
- Verificación automática de que el enlace es público y accesible.
- Previsualización del PDF embebida desde Google Drive.
- Soporte para Dropbox, OneDrive o cualquier URL pública.

### 7.5 Sistema de Notificaciones

- Notificación push o email al publicar una nueva sesión.
- Recordatorio 24 horas antes de la próxima sesión.
- Alertas de cantos con links rotos o sin PDF.

### 7.6 Favoritos y Listas Personales

- Marcar cantos como favoritos para acceso rápido.
- Compartir sesión por URL directa o código QR.
- Acceso offline a cantos descargados (Fase 2 – App Móvil).

### 7.7 Comentarios y Retroalimentación Interna

- Comentarios internos por canto (solo admins).
- Notas por canto dentro de una sesión.
- Sistema de sugerencias de cantos por usuarios básicos.
- Historial de cambios por canto (quién editó y qué cambió).

---

## 8. Requerimientos No Funcionales

### Rendimiento
- Carga inicial de la app: < 3 segundos en conexión 4G.
- Respuesta de búsquedas y filtros: < 1 segundo para catálogos de hasta 500 cantos.
- Visor de PDF: inicio en menos de 2 segundos desde el clic.

### Usabilidad y Experiencia Móvil
- Diseño mobile-first: pantallas de 360 px a 430 px de ancho.
- Botones e íconos de mínimo 44×44 px (estándar de accesibilidad táctil).
- Navegación principal con bottom navigation bar en móvil.
- Soporte para modo oscuro del sistema operativo.

### Seguridad
- Autenticación por JWT con refresh token (Supabase Auth).
- Todas las comunicaciones bajo HTTPS.
- RLS en PostgreSQL valida permisos a nivel de fila (no solo en frontend).
- Sanitización de inputs en el cliente y en las políticas de BD.

### Disponibilidad y Escalabilidad
- Disponibilidad objetivo: 99.5 % mensual.
- Hasta 200 usuarios concurrentes sin degradación.
- API REST versionada (`/api/v1/`) para cambios sin romper clientes existentes.

### Accesibilidad
- WCAG 2.1 nivel AA como mínimo.
- Contraste adecuado para lectura en exteriores.

---

## 9. Arquitectura con Supabase

### 9.1 ¿Por qué Supabase?

| Criterio | Supabase | BD tradicional + API custom |
|----------|----------|-----------------------------|
| Tiempo de puesta en marcha | < 1 día | 3–5 días |
| Autenticación | Nativa (email, magic link, OAuth) | Implementación propia |
| Seguridad a nivel de fila | RLS nativa en PostgreSQL | Lógica en la aplicación |
| API REST | Auto-generada (PostgREST) | Implementación manual |
| Realtime | WebSockets nativos | Redis + Socket.io adicional |
| Storage de archivos | Integrado con políticas y CDN | S3/GCS a configurar |
| Plan gratuito | Generoso (500 MB BD, 1 GB Storage, 50K MAU) | Costo desde día 1 |
| SDK para móvil (Fase 2) | Disponible para React Native y Flutter | Adaptar API custom |

### 9.2 Diagrama de Componentes

```
┌─────────────────────────────────────────────┐
│               CLIENTE WEB                   │
│   React + TypeScript + Tailwind (Vercel)     │
└────────────────────┬────────────────────────┘
                     │ @supabase/supabase-js
┌────────────────────▼────────────────────────┐
│                SUPABASE                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Auth     │  │PostgREST │  │ Realtime  │  │
│  │ (JWT/RLS)│  │ (REST API│  │(WebSocket)│  │
│  └──────────┘  └────┬─────┘  └───────────┘  │
│  ┌──────────┐  ┌────▼─────┐                 │
│  │ Storage  │  │PostgreSQL│                  │
│  │(PDF/Audio│  │   15     │                  │
│  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│         REPOSITORIO DE ARCHIVOS              │
│   Google Drive / Dropbox / URL pública       │
│   (Fase 1) → Supabase Storage (Fase 1.5)    │
└─────────────────────────────────────────────┘
```

### 9.3 Flujo de Autenticación

1. Usuario ingresa email y contraseña (o solicita Magic Link).
2. El cliente llama a `supabase.auth.signInWithPassword()`.
3. Supabase Auth retorna `access_token` + `refresh_token` (JWT).
4. El SDK almacena los tokens automáticamente (`localStorage` en web).
5. Cada petición incluye el JWT en `Authorization: Bearer <token>`.
6. RLS en PostgreSQL evalúa `auth.uid()` y `auth.role()` por cada query.
7. El `refresh_token` renueva el `access_token` automáticamente (cada hora).
8. En Fase 2 (móvil), el mismo flujo aplica con el SDK de React Native/Flutter.

### 9.4 Estrategia de Roles con RLS

| Rol Supabase | Mapeo en CantoManager | Descripción |
|---|---|---|
| `anon` | Visitante | Solo ve sesiones y cantos publicados. Sin escritura |
| `authenticated` | Usuario Básico | Lee cantos y sesiones activos |
| `authenticated` + claim `admin` | Administrador | CRUD completo sobre todas las tablas |
| `service_role` | Sistema | Bypasea RLS. Nunca expuesto al cliente |

---

## 10. Esquema de Base de Datos (PostgreSQL / Supabase)

### Extensiones necesarias

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- Búsqueda full-text fuzzy
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- Búsqueda sin acentos
```

### Tabla: perfiles

```sql
CREATE TABLE public.perfiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre         TEXT NOT NULL,
  apellido       TEXT,
  rol            TEXT NOT NULL DEFAULT 'basico'
                   CHECK (rol IN ('basico', 'admin')),
  avatar_url     TEXT,
  activo         BOOLEAN NOT NULL DEFAULT true,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: crear perfil automáticamente al registrar usuario en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email),
    'basico'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Catálogos base

```sql
-- Tiempos litúrgicos
CREATE TABLE public.tiempos_liturgicos (
  id          SERIAL PRIMARY KEY,
  codigo      TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  color       TEXT,
  descripcion TEXT,
  orden       INT NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true
);

-- Tipos de canto
CREATE TABLE public.tipos_canto (
  id             SERIAL PRIMARY KEY,
  codigo         TEXT UNIQUE NOT NULL,
  nombre         TEXT NOT NULL,
  descripcion    TEXT,
  es_obligatorio BOOLEAN DEFAULT false,
  orden          INT NOT NULL DEFAULT 0,
  activo         BOOLEAN NOT NULL DEFAULT true
);

-- Usos del canto
CREATE TABLE public.usos_canto (
  id          SERIAL PRIMARY KEY,
  codigo      TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  orden       INT NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true
);

-- Tipos de celebración
CREATE TABLE public.tipos_celebracion (
  id     SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  orden  INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);
```

### Tabla: cantos

```sql
CREATE TABLE public.cantos (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo             TEXT NOT NULL,
  autor              TEXT,
  tono_base          TEXT,
  url_pdf            TEXT,
  url_audio          TEXT,
  storage_pdf_path   TEXT,   -- Supabase Storage (Fase 1.5)
  storage_audio_path TEXT,   -- Supabase Storage (Fase 1.5)
  tipo_canto_id      INT REFERENCES public.tipos_canto(id),
  tags               TEXT[] DEFAULT '{}',
  notas              TEXT,
  activo             BOOLEAN NOT NULL DEFAULT true,
  creado_por         UUID REFERENCES auth.users(id),
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relación M:N — canto puede tener múltiples tiempos litúrgicos
CREATE TABLE public.canto_tiempos_liturgicos (
  canto_id            UUID REFERENCES public.cantos(id) ON DELETE CASCADE,
  tiempo_liturgico_id INT  REFERENCES public.tiempos_liturgicos(id) ON DELETE CASCADE,
  PRIMARY KEY (canto_id, tiempo_liturgico_id)
);

-- Relación M:N — canto puede tener múltiples usos
CREATE TABLE public.canto_usos (
  canto_id UUID REFERENCES public.cantos(id) ON DELETE CASCADE,
  uso_id   INT  REFERENCES public.usos_canto(id) ON DELETE CASCADE,
  PRIMARY KEY (canto_id, uso_id)
);

-- Índices para búsqueda eficiente
CREATE INDEX idx_cantos_titulo_trgm ON public.cantos USING gin(titulo gin_trgm_ops);
CREATE INDEX idx_cantos_tags        ON public.cantos USING gin(tags);
CREATE INDEX idx_cantos_tipo        ON public.cantos(tipo_canto_id);
CREATE INDEX idx_cantos_activo      ON public.cantos(activo);
```

### Tabla: sesiones

```sql
CREATE TABLE public.sesiones (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre              TEXT NOT NULL,
  fecha               DATE NOT NULL,
  descripcion         TEXT,
  tipo_celebracion_id INT REFERENCES public.tipos_celebracion(id),
  tiempo_liturgico_id INT REFERENCES public.tiempos_liturgicos(id),
  ministro_responsable TEXT,
  notas_internas      TEXT,
  publicada           BOOLEAN NOT NULL DEFAULT false,
  creado_por          UUID REFERENCES auth.users(id),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relación ordenada sesión ↔ cantos
CREATE TABLE public.sesion_cantos (
  id        SERIAL PRIMARY KEY,
  sesion_id UUID REFERENCES public.sesiones(id) ON DELETE CASCADE,
  canto_id  UUID REFERENCES public.cantos(id) ON DELETE RESTRICT,
  orden     INT NOT NULL DEFAULT 0,
  notas     TEXT,
  UNIQUE (sesion_id, orden)
);

CREATE INDEX idx_sesiones_fecha       ON public.sesiones(fecha DESC);
CREATE INDEX idx_sesiones_publicada   ON public.sesiones(publicada);
CREATE INDEX idx_sesion_cantos_sesion ON public.sesion_cantos(sesion_id);
```

### Tabla: favoritos

```sql
CREATE TABLE public.favoritos (
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  canto_id   UUID REFERENCES public.cantos(id) ON DELETE CASCADE,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, canto_id)
);
```

### Trigger: actualizado_en automático

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cantos_updated
  BEFORE UPDATE ON public.cantos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_sesiones_updated
  BEFORE UPDATE ON public.sesiones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_perfiles_updated
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 11. Row Level Security (RLS)

### Habilitar RLS en todas las tablas

```sql
ALTER TABLE public.perfiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cantos                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesion_cantos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canto_tiempos_liturgicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canto_usos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiempos_liturgicos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_canto              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usos_canto               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_celebracion        ENABLE ROW LEVEL SECURITY;
```

### Función auxiliar: is_admin()

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol = 'admin' AND activo = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### Políticas: cantos

```sql
-- Todos leen cantos activos
CREATE POLICY "cantos_select_public"
  ON public.cantos FOR SELECT
  USING (activo = true);

-- Solo admin escribe
CREATE POLICY "cantos_insert_admin"
  ON public.cantos FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "cantos_update_admin"
  ON public.cantos FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "cantos_delete_admin"
  ON public.cantos FOR DELETE
  USING (public.is_admin());
```

### Políticas: sesiones

```sql
-- Usuarios autenticados ven sesiones publicadas; admin ve todas
CREATE POLICY "sesiones_select"
  ON public.sesiones FOR SELECT
  USING (publicada = true OR public.is_admin());

CREATE POLICY "sesiones_insert_admin"
  ON public.sesiones FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "sesiones_update_admin"
  ON public.sesiones FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "sesiones_delete_admin"
  ON public.sesiones FOR DELETE
  USING (public.is_admin());
```

### Políticas: perfiles

```sql
-- Cada usuario ve su propio perfil; admin ve todos
CREATE POLICY "perfiles_select_own"
  ON public.perfiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

-- Usuario actualiza su perfil pero no puede cambiar su rol
CREATE POLICY "perfiles_update_own"
  ON public.perfiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    (
      rol = (SELECT rol FROM public.perfiles WHERE id = auth.uid())
      OR public.is_admin()
    )
  );
```

### Políticas: favoritos

```sql
CREATE POLICY "favoritos_select_own"
  ON public.favoritos FOR SELECT
  USING (usuario_id = auth.uid());

CREATE POLICY "favoritos_insert_own"
  ON public.favoritos FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "favoritos_delete_own"
  ON public.favoritos FOR DELETE
  USING (usuario_id = auth.uid());
```

### Políticas: catálogos (lectura pública, escritura solo admin)

```sql
-- Aplica igual a: tiempos_liturgicos, tipos_canto, usos_canto, tipos_celebracion
CREATE POLICY "catalogo_select_all"  ON public.tiempos_liturgicos FOR SELECT USING (true);
CREATE POLICY "catalogo_write_admin" ON public.tiempos_liturgicos FOR ALL    USING (public.is_admin());

CREATE POLICY "catalogo_select_all"  ON public.tipos_canto       FOR SELECT USING (true);
CREATE POLICY "catalogo_write_admin" ON public.tipos_canto       FOR ALL    USING (public.is_admin());

CREATE POLICY "catalogo_select_all"  ON public.usos_canto        FOR SELECT USING (true);
CREATE POLICY "catalogo_write_admin" ON public.usos_canto        FOR ALL    USING (public.is_admin());

CREATE POLICY "catalogo_select_all"  ON public.tipos_celebracion FOR SELECT USING (true);
CREATE POLICY "catalogo_write_admin" ON public.tipos_celebracion FOR ALL    USING (public.is_admin());
```

---

## 12. Supabase Storage

### Estructura de Buckets

| Bucket | Contenido | Acceso | Política |
|--------|-----------|--------|----------|
| `cantos-pdf` | PDFs de letras | Público (sin auth) | Lectura libre; escritura solo admin |
| `cantos-audio` | Audios de referencia | Autenticado | Lectura con JWT; escritura solo admin |
| `avatares` | Fotos de perfil | Autenticado | Cada usuario lee/escribe el suyo |

### Políticas de Storage

```sql
-- Bucket: cantos-pdf (público)
CREATE POLICY "pdf_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cantos-pdf');

CREATE POLICY "pdf_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cantos-pdf' AND public.is_admin());

-- Bucket: cantos-audio (usuarios autenticados)
CREATE POLICY "audio_auth_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cantos-audio' AND auth.role() = 'authenticated');

CREATE POLICY "audio_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cantos-audio' AND public.is_admin());
```

### Lógica de prioridad PDF/Audio

La app detectará cuál campo tiene valor y lo priorizará en este orden:

1. `storage_pdf_path` (Supabase Storage) → URL firmada o pública del bucket.
2. `url_pdf` (URL externa) → Se abre en nueva pestaña o iframe.

---

## 13. Realtime con Supabase

Supabase Realtime permite suscribirse a cambios en la BD mediante WebSockets.

| Evento | Tabla | Suscriptor | Comportamiento |
|--------|-------|-----------|----------------|
| INSERT / UPDATE sesion | `sesiones` | Todos los autenticados | Toast: "Nueva sesión publicada" |
| UPDATE publicada → true | `sesiones` | Usuarios básicos | La sesión aparece sin recargar |
| INSERT canto | `cantos` | Administradores | Badge en menú de catálogo |
| UPDATE sesion_cantos | `sesion_cantos` | Admins en pantalla de edición | Lista actualiza en tiempo real |

### Ejemplo de suscripción en React

```typescript
import { supabase } from '@/lib/supabase';

const channel = supabase
  .channel('sesiones-publicas')
  .on('postgres_changes', {
    event:  'UPDATE',
    schema: 'public',
    table:  'sesiones',
    filter: 'publicada=eq.true',
  }, (payload) => {
    setSesiones(prev => [...prev, payload.new]);
  })
  .subscribe();

// Cleanup al desmontar
return () => supabase.removeChannel(channel);
```

---

## 14. SDK y Configuración del Cliente

### Instalación

```bash
npm install @supabase/supabase-js
```

### Inicialización (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types'; // Tipos generados por CLI

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,  // Para magic links y OAuth redirects
  },
});
```

### Variables de entorno (`.env`)

```env
# Públicas — seguras gracias a RLS
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>

# NUNCA exponer al cliente — solo para scripts de servidor
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

### Queries de ejemplo

#### Buscar cantos con filtros múltiples

```typescript
const { data, error } = await supabase
  .from('cantos')
  .select(`
    id, titulo, autor, url_pdf, url_audio, tono_base,
    tipo_canto:tipos_canto(id, nombre),
    tiempos:canto_tiempos_liturgicos(tiempo:tiempos_liturgicos(id, nombre)),
    usos:canto_usos(uso:usos_canto(id, nombre))
  `)
  .eq('activo', true)
  .ilike('titulo', `%${busqueda}%`)
  .eq('tipo_canto_id', tipoCanto)   // opcional
  .order('titulo', { ascending: true })
  .range(offset, offset + limit - 1);
```

#### Sesiones próximas (30 días)

```typescript
const hoy  = new Date().toISOString().split('T')[0];
const en30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const { data } = await supabase
  .from('sesiones')
  .select(`
    id, nombre, fecha, descripcion, publicada,
    tipo_celebracion:tipos_celebracion(nombre),
    tiempo_liturgico:tiempos_liturgicos(nombre, color),
    sesion_cantos(orden, notas, canto:cantos(id, titulo, url_pdf, url_audio))
  `)
  .eq('publicada', true)
  .gte('fecha', hoy)
  .lte('fecha', en30)
  .order('fecha', { ascending: true });
```

#### Login con email

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email:    'coordinador@parroquia.com',
  password: 'contraseña-segura',
});

// Obtener rol del usuario
const { data: perfil } = await supabase
  .from('perfiles')
  .select('rol, nombre')
  .eq('id', data.user.id)
  .single();

const esAdmin = perfil?.rol === 'admin';
```

---

## 15. Supabase CLI y Migraciones

### Configuración inicial

```bash
npm install -g supabase

supabase init
supabase link --project-ref <project-ref>

# Generar tipos TypeScript desde el esquema
supabase gen types typescript --linked > src/types/database.types.ts
```

### Flujo de trabajo

```bash
# Crear nueva migración
supabase migration new nombre_de_la_migracion
# → supabase/migrations/20260424_nombre_de_la_migracion.sql

# Aplicar migraciones localmente
supabase db reset

# Aplicar en producción
supabase db push

# Ver estado
supabase migration list
```

---

## 16. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Base de datos | Supabase (PostgreSQL 15) | BaaS con BD gestionada, backups automáticos, extensiones `pg_trgm` |
| Autenticación | Supabase Auth | Email/password, Magic Link, OAuth. Sin código custom |
| API de datos | PostgREST (auto-generada) | REST API del esquema. Sin endpoints manuales para CRUD básico |
| Seguridad | Row Level Security (RLS) | Permisos a nivel de fila en PostgreSQL |
| Storage | Supabase Storage (Fase 1.5) | Buckets para PDF y audio con políticas integradas |
| Realtime | Supabase Realtime | WebSockets nativos. Sin backend adicional |
| Frontend | React + TypeScript + Tailwind CSS | SPA mobile-first con tipado desde tipos generados |
| Estado global | Zustand + React Query | Cache de queries Supabase y estado de sesión |
| Hosting | Vercel | Deploy automático desde GitHub, HTTPS automático |
| CI/CD | GitHub Actions + Supabase CLI | Migraciones automáticas en merge a `main` |
| App Móvil (Fase 2) | React Native + `@supabase/supabase-js` | Mismo SDK, máxima reutilización de lógica |
| Tipado BD | `supabase gen types` | Tipos TypeScript generados del esquema |

---

## 17. Plan de Configuración Inicial de Supabase

Ejecutar en orden:

1. Crear proyecto en [app.supabase.com](https://app.supabase.com). Seleccionar región cercana (`us-east-1` o `sa-east-1`).
2. Ejecutar el script de **extensiones** (sección 10) en el SQL Editor.
3. Ejecutar los scripts de **tablas** en orden: `perfiles` → catálogos → `cantos` → `sesiones` → `favoritos`.
4. Ejecutar los **triggers** (`set_updated_at` y `handle_new_user`).
5. Ejecutar las **políticas RLS** en orden: habilitar RLS → `is_admin()` → políticas por tabla.
6. **Poblar catálogos** base con los datos de la sección 5.3.
7. Crear el **primer usuario administrador** desde Supabase Dashboard → Authentication → Users → Invite User. Actualizar `rol = 'admin'` en la tabla `perfiles`.
8. Configurar **variables de entorno** en Vercel: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
9. Ejecutar `supabase gen types typescript` para generar tipos del proyecto.
10. Configurar **GitHub Actions** para ejecutar `supabase db push` en cada merge a `main`.

---

## 18. Límites del Plan Gratuito y Costos

| Recurso | Plan Free | Estimación CantoManager | ¿Suficiente? |
|---------|-----------|------------------------|--------------|
| Base de datos | 500 MB | < 50 MB para 1,000 cantos y 500 sesiones | ✅ Sí |
| Auth - MAU | 50,000 usuarios/mes | < 100 usuarios activos | ✅ Sí |
| Storage | 1 GB | 200–500 MB (PDFs y audios) | ✅ Sí (Fase 1.5) |
| Realtime | 200 conexiones concurrentes | < 50 usuarios simultáneos | ✅ Sí |
| Ancho de banda | 5 GB/mes | < 1 GB/mes estimado | ✅ Sí |
| Proyectos activos | 2 | 1 prod + 1 staging | ✅ Exacto |
| Backups | 7 días | Suficiente para Fase 1 | ✅ Sí |

> Cuando el proyecto supere los límites, el upgrade al **Plan Pro** cuesta **USD $25/mes** e incluye 8 GB de BD, 100 GB de Storage y backups de 30 días. No requiere cambios en el código ni en la arquitectura.

---

## 19. Consideraciones de Seguridad

> ⚠️ **Reglas obligatorias — aplicar antes de ir a producción**

- **NUNCA** exponer la `SUPABASE_SERVICE_ROLE_KEY` en el cliente. Solo en scripts de servidor o GitHub Actions.
- El `SUPABASE_ANON_KEY` es público por diseño: es seguro en el frontend porque RLS protege los datos.
- **Todas las tablas deben tener RLS habilitado** antes de ir a producción. Supabase lo indica con alertas en el Dashboard.
- En Supabase Auth → Settings: deshabilitar confirmación de email en desarrollo; habilitarla en producción.
- Configurar `SITE_URL` y `REDIRECT_URLS` en Supabase Auth para evitar redirecciones OAuth a dominios no autorizados.
- El rate limiting por IP está habilitado por defecto en Supabase (protección anti fuerza bruta).
- Revisar periódicamente los logs de Auth en el Dashboard para detectar accesos no autorizados.

---

## 20. Plan de Fases y Roadmap

### Fase 1 — MVP Web (Meses 1–3)

- [ ] Autenticación y gestión de usuarios (Supabase Auth + tabla perfiles)
- [ ] CRUD completo de cantos con todos los campos
- [ ] CRUD de sesiones con lista ordenada de cantos
- [ ] Visor de PDF y reproductor de audio integrado
- [ ] Búsqueda y filtros en cantos y sesiones
- [ ] Administración de catálogos base
- [ ] Vista móvil optimizada (mobile-first)
- [ ] RLS completo en todas las tablas
- [ ] Deploy en Vercel con CI/CD desde GitHub

### Fase 1.5 — PWA y Mejoras UX (Meses 3–4)

- [ ] Configurar app como PWA (instalable desde el navegador)
- [ ] Dashboard con próximas sesiones y accesos rápidos
- [ ] Supabase Storage para PDFs y audios (migración desde URLs externas)
- [ ] Sistema de notificaciones web (sesión publicada, recordatorios)
- [ ] Favoritos de cantos por usuario
- [ ] Exportación de sesiones en PDF imprimible
- [ ] Estadísticas básicas de uso para administradores
- [ ] Suscripciones Realtime para actualizaciones en vivo

### Fase 2 — App Móvil Nativa (Meses 5–8)

- [ ] App nativa para iOS y Android (React Native)
- [ ] Modo offline: acceso a sesiones y cantos descargados
- [ ] Notificaciones push nativas
- [ ] Modo presentación para tablet/pantalla grande
- [ ] Compartir sesión por URL o código QR
- [ ] Selector de archivos Google Drive integrado en la app

---

## 21. Criterios de Aceptación

Un requerimiento se considera **completado** cuando:

1. La funcionalidad se comporta según lo especificado en Chrome, Safari y Firefox (versiones actuales).
2. La vista es usable en dispositivos de 360 px a 430 px de ancho sin scroll horizontal.
3. Los permisos por rol funcionan en frontend **y en backend** (RLS de Supabase).
4. El rendimiento cumple los umbrales: carga < 3 s, búsqueda < 1 s.
5. El código incluye pruebas unitarias para lógica crítica y pruebas de integración para queries principales.
6. La documentación del componente/feature está actualizada en el repositorio.
7. El feature pasó code review por al menos un miembro del equipo.

---

## 22. Glosario

| Término | Definición |
|---------|-----------|
| **Canto** | Himno o canción litúrgica usada en celebraciones religiosas católicas |
| **Sesión de canto** | Agrupación ordenada de cantos para una celebración en una fecha específica |
| **Tiempo litúrgico** | Período del calendario litúrgico católico (Adviento, Navidad, Cuaresma, Pascua, Tiempo Ordinario) |
| **Tipo de canto** | Clasificación según el momento de la celebración eucarística |
| **Uso del canto** | Clasificación adicional según el tipo de celebración |
| **Supabase** | Plataforma Backend-as-a-Service de código abierto basada en PostgreSQL |
| **PostgREST** | Servidor que genera automáticamente una API REST desde el esquema de PostgreSQL |
| **RLS** | Row Level Security: mecanismo de PostgreSQL para controlar acceso a filas individuales |
| **anon key** | Clave pública de Supabase para peticiones no autenticadas. Segura porque RLS la protege |
| **service_role key** | Clave privada que bypasea RLS. Solo para uso en servidores o scripts admin. Nunca al cliente |
| **auth.uid()** | Función de PostgreSQL que retorna el UUID del usuario autenticado en la sesión actual |
| **Bucket** | Contenedor lógico de archivos en Supabase Storage con políticas de acceso propias |
| **Signed URL** | URL temporal firmada para acceder a archivos privados en Supabase Storage |
| **Magic Link** | Enlace de autenticación enviado por email que no requiere contraseña |
| **PWA** | Progressive Web App: app web instalable en el dispositivo que funciona como app nativa |
| **Mobile-first** | Enfoque de diseño que prioriza la experiencia en pantallas pequeñas |
| **CRUD** | Create, Read, Update, Delete: operaciones básicas de gestión de datos |
| **Soft delete** | Desactivación lógica de un registro sin eliminarlo físicamente de la BD |
| **MAU** | Monthly Active Users: usuarios únicos que se autentican en un mes |

---

*CantoManager — PRD v1.1 Supabase Edition — Abril 2026*
