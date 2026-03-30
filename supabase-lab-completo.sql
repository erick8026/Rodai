-- ============================================================
-- RODAI CRM — Schema Completo para LAB (snknbzmcpcxybbgpzyua)
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla leads (esquema completo de producción)
create table if not exists leads (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text default '',
  telefono              text unique,
  correo                text default '',
  empresa               text default '',
  faq_respuestas        text default '',
  idioma                text default 'espanol',
  fecha                 text default '',
  estado                text default 'nuevo',
  fuente                text default 'whatsapp',
  notas                 text default '',
  paquetes_contratados  text default '[]',
  frecuencia_pago       text default 'mensual',
  valor_oportunidad     numeric default 0,
  fecha_cierre_esperada date,
  probabilidad          int default 10,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- 2. Tabla productos
create table if not exists productos (
  id             uuid primary key default gen_random_uuid(),
  sku            text unique not null,
  nombre         text not null,
  descripcion    text default '',
  precio_mensual numeric default 0,
  precio_anual   numeric default 0,
  costo          numeric default 0,
  activo         boolean default true,
  created_at     timestamptz default now()
);

-- 3. Tabla propuestas
create table if not exists propuestas (
  id               uuid primary key default gen_random_uuid(),
  token            text unique default gen_random_uuid()::text,
  lead_id          uuid references leads(id) on delete cascade,
  cliente_nombre   text default '',
  cliente_empresa  text default '',
  cliente_telefono text default '',
  plan_sku         text,
  notas_propuesta  text default '',
  visto_at         timestamptz,
  created_at       timestamptz default now()
);

-- ============================================================
-- MULTI-TENANT
-- ============================================================

-- 4. Tabla de tenants
create table if not exists tenants (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  nombre     text not null,
  plan       text default 'basico',   -- basico | pro | premium
  activo     boolean default true,
  created_at timestamptz default now()
);

-- 5. Agregar tenant_id a las tablas existentes
alter table leads add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_leads_tenant on leads(tenant_id);

alter table productos add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_productos_tenant on productos(tenant_id);

alter table propuestas add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_propuestas_tenant on propuestas(tenant_id);

-- ============================================================
-- RLS — denegar anon en todas las tablas
-- (service_role bypasses RLS automáticamente)
-- ============================================================

alter table tenants enable row level security;
drop policy if exists "Allow all" on tenants;
create policy "deny_anon" on tenants for all using (false) with check (false);

alter table leads enable row level security;
drop policy if exists "Allow all" on leads;
create policy "deny_anon" on leads for all using (false) with check (false);

alter table productos enable row level security;
drop policy if exists "Allow all" on productos;
create policy "deny_anon" on productos for all using (false) with check (false);

alter table propuestas enable row level security;
drop policy if exists "Allow all" on propuestas;
create policy "deny_anon" on propuestas for all using (false) with check (false);

-- ============================================================
-- Tenant inicial: RODAI (tu cuenta de admin)
-- ============================================================
insert into tenants (slug, nombre, plan)
values ('rodai', 'RODAI', 'premium')
on conflict (slug) do nothing;
