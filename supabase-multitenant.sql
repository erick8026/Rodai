-- ============================================================
-- RODAI CRM — Schema Multi-Tenant (LAB)
-- Pegar en Supabase SQL Editor del proyecto de labrodai
-- ============================================================

-- 1. Tabla de tenants (cada cliente de RODAI es un tenant)
create table if not exists tenants (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,      -- ej: "clinica-sosa", "taller-campos"
  nombre     text not null,
  plan       text default 'basico',     -- basico | pro | premium
  activo     boolean default true,
  created_at timestamptz default now()
);

-- 2. Agregar tenant_id a leads
alter table leads add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_leads_tenant on leads(tenant_id);

-- 3. Agregar tenant_id a productos
alter table productos add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_productos_tenant on productos(tenant_id);

-- 4. Agregar tenant_id a propuestas
alter table propuestas add column if not exists tenant_id uuid references tenants(id) on delete cascade;
create index if not exists idx_propuestas_tenant on propuestas(tenant_id);

-- 5. RLS: denegar anon en todas las tablas (service_role bypasses RLS automáticamente)
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

-- 6. Tenant inicial: RODAI (tu cuenta de admin)
insert into tenants (slug, nombre, plan)
values ('rodai', 'RODAI', 'premium')
on conflict (slug) do nothing;

-- ============================================================
-- SQL SOLO PRODUCCIÓN (pegar en el proyecto de producción)
-- Solo cambia el RLS — NO agrega columnas
-- ============================================================
-- alter table leads enable row level security;
-- drop policy if exists "Allow all" on leads;
-- create policy "deny_anon" on leads for all using (false) with check (false);
-- (repetir para: propuestas, productos, prospectos)
