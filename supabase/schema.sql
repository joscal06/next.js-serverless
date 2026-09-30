-- =====================================================================
-- Destinos SV · Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query
-- Es idempotente: se puede volver a ejecutar sin errores.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tablas
-- ---------------------------------------------------------------------

create table if not exists public.categorias (
  id          smallint generated always as identity primary key,
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  nombre      text not null,
  descripcion text not null,
  icono       text not null,              -- emoji representativo
  color       text not null default '#0f766e',
  imagen_url  text,
  orden       smallint not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.destinos (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  nombre          text not null,
  departamento    text not null,
  categoria_id    smallint not null references public.categorias (id) on delete restrict,
  resumen         text not null,
  descripcion     text not null,
  imagen_url      text,
  imagen_credito  text,
  precio_entrada  numeric(6, 2) not null default 0 check (precio_entrada >= 0),
  mejor_epoca     text,
  duracion        text,
  actividades     text[] not null default '{}',
  destacado       boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists destinos_categoria_idx on public.destinos (categoria_id);
create index if not exists destinos_destacado_idx on public.destinos (destacado) where destacado;

create table if not exists public.resenas (
  id           uuid primary key default gen_random_uuid(),
  destino_id   uuid not null references public.destinos (id) on delete cascade,
  autor        text not null check (char_length(autor) between 2 and 60),
  calificacion smallint not null check (calificacion between 1 and 5),
  comentario   text not null check (char_length(comentario) between 10 and 600),
  -- Hash SHA-256 del token que recibe quien escribe la reseña.
  -- Nunca es legible por los clientes (ver privilegios por columna abajo).
  token_hash   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);

create index if not exists resenas_destino_idx on public.resenas (destino_id, created_at desc);

-- ---------------------------------------------------------------------
-- 2. Vista con calificación promedio (respeta RLS con security_invoker)
-- ---------------------------------------------------------------------

create or replace view public.vista_destinos
with (security_invoker = true) as
select
  d.id,
  d.slug,
  d.nombre,
  d.departamento,
  d.resumen,
  d.imagen_url,
  d.precio_entrada,
  d.destacado,
  d.created_at,
  c.slug   as categoria_slug,
  c.nombre as categoria_nombre,
  c.icono  as categoria_icono,
  coalesce(round(avg(r.calificacion)::numeric, 1), 0)::float as calificacion_promedio,
  count(r.id)::int as total_resenas
from public.destinos d
join public.categorias c on c.id = d.categoria_id
left join public.resenas r on r.destino_id = d.id
group by d.id, c.id;

-- ---------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------

alter table public.categorias enable row level security;
alter table public.destinos   enable row level security;
alter table public.resenas    enable row level security;

-- Lectura pública del catálogo
drop policy if exists "Lectura publica de categorias" on public.categorias;
create policy "Lectura publica de categorias"
  on public.categorias for select
  to anon, authenticated
  using (true);

drop policy if exists "Lectura publica de destinos" on public.destinos;
create policy "Lectura publica de destinos"
  on public.destinos for select
  to anon, authenticated
  using (true);

-- Reseñas: cualquiera puede leer y publicar (con validaciones).
drop policy if exists "Lectura publica de resenas" on public.resenas;
create policy "Lectura publica de resenas"
  on public.resenas for select
  to anon, authenticated
  using (true);

drop policy if exists "Publicar resenas validas" on public.resenas;
create policy "Publicar resenas validas"
  on public.resenas for insert
  to anon, authenticated
  with check (
    calificacion between 1 and 5
    and char_length(trim(autor)) >= 2
    and char_length(trim(comentario)) >= 10
    and token_hash is not null
    and updated_at is null
  );

-- No existen políticas UPDATE / DELETE: los clientes no pueden modificar
-- ni borrar filas directamente. Solo mediante las funciones de la sección 5,
-- que verifican el token del autor.

-- ---------------------------------------------------------------------
-- 4. Privilegios por columna (el token_hash nunca se expone)
-- ---------------------------------------------------------------------

revoke all on public.categorias from anon, authenticated;
revoke all on public.destinos   from anon, authenticated;
revoke all on public.resenas    from anon, authenticated;

grant select on public.categorias     to anon, authenticated;
grant select on public.destinos       to anon, authenticated;
grant select on public.vista_destinos to anon, authenticated;

grant select (id, destino_id, autor, calificacion, comentario, created_at, updated_at)
  on public.resenas to anon, authenticated;
grant insert (id, destino_id, autor, calificacion, comentario, token_hash)
  on public.resenas to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Funciones para editar / eliminar la reseña propia
-- ---------------------------------------------------------------------

create or replace function public.editar_resena(
  p_id uuid,
  p_token text,
  p_calificacion smallint,
  p_comentario text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  filas int;
begin
  if p_calificacion not between 1 and 5 then
    raise exception 'La calificación debe estar entre 1 y 5';
  end if;
  if char_length(trim(p_comentario)) not between 10 and 600 then
    raise exception 'El comentario debe tener entre 10 y 600 caracteres';
  end if;

  update public.resenas
     set calificacion = p_calificacion,
         comentario   = trim(p_comentario),
         updated_at   = now()
   where id = p_id
     and token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');

  get diagnostics filas = row_count;
  return filas = 1;
end;
$$;

create or replace function public.eliminar_resena(
  p_id uuid,
  p_token text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  filas int;
begin
  delete from public.resenas
   where id = p_id
     and token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');

  get diagnostics filas = row_count;
  return filas = 1;
end;
$$;

revoke execute on function public.editar_resena(uuid, text, smallint, text) from public;
revoke execute on function public.eliminar_resena(uuid, text) from public;
grant execute on function public.editar_resena(uuid, text, smallint, text) to anon, authenticated;
grant execute on function public.eliminar_resena(uuid, text) to anon, authenticated;
