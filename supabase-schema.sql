-- Run this in the Supabase SQL Editor
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  nombre          text default '',
  telefono        text unique,
  correo          text default '',
  empresa         text default '',
  faq_respuestas  text default '',
  idioma          text default 'espanol',
  fecha           text default '',
  estado          text default 'nuevo',
  fuente          text default 'whatsapp',
  notas           text default '',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow all operations with anon key (CRM controls auth via JWT)
create policy "Allow all" on leads for all using (true) with check (true);
