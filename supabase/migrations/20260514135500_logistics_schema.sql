create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  role text not null default 'collaborator',
  created_at timestamptz not null default now()
);

create table if not exists checklists (
  id uuid primary key default gen_random_uuid(),
  codigo_at text not null,
  share_token text not null unique,
  observacoes_renato text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  artigo text not null,
  descricao text not null,
  quantidade numeric not null,
  unidade text not null,
  checked boolean not null default false
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null unique references checklists(id) on delete cascade,
  responsavel text not null,
  observacoes text not null default '',
  assinatura text not null default '',
  submitted_at timestamptz not null default now()
);

create table if not exists export_history (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  export_format text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_checklists_status on checklists(status);
create index if not exists idx_checklists_share_token on checklists(share_token);
create index if not exists idx_items_checklist_id on checklist_items(checklist_id);
create index if not exists idx_exports_checklist_id on export_history(checklist_id);
