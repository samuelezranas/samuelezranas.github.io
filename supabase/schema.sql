create extension if not exists pgcrypto;

create table if not exists about_settings (
  id integer primary key default 1,
  title text not null,
  lead text not null,
  resume_url text,
  updated_at timestamptz not null default now()
);

create table if not exists about_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year text,
  image_url text not null,
  credential_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  external_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references portfolio_categories(id) on delete cascade,
  title text not null,
  description text not null,
  image_url text not null,
  tech_stack text,
  repository_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists contact_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table about_settings enable row level security;
alter table about_photos enable row level security;
alter table certifications enable row level security;
alter table portfolio_categories enable row level security;
alter table portfolio_projects enable row level security;
alter table contact_links enable row level security;

create policy if not exists "public read about settings" on about_settings for select using (true);
create policy if not exists "public read about photos" on about_photos for select using (is_active = true);
create policy if not exists "public read certifications" on certifications for select using (is_active = true);
create policy if not exists "public read categories" on portfolio_categories for select using (is_active = true);
create policy if not exists "public read projects" on portfolio_projects for select using (is_active = true);
create policy if not exists "public read contacts" on contact_links for select using (is_active = true);

-- NOTE:
-- Untuk admin panel dari browser, paling aman pakai Supabase Auth + role-based policy.
-- Sementara development cepat, kamu bisa buat policy write sementara berikut:
-- using (true) with check (true) untuk authenticated users.
