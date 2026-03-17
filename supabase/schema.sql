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

create table if not exists contact_message (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table about_settings enable row level security;
alter table about_photos enable row level security;
alter table certifications enable row level security;
alter table portfolio_categories enable row level security;
alter table portfolio_projects enable row level security;
alter table contact_links enable row level security;
alter table contact_message enable row level security;

drop policy if exists "public read about settings" on about_settings;
drop policy if exists "public read about photos" on about_photos;
drop policy if exists "public read certifications" on certifications;
drop policy if exists "public read categories" on portfolio_categories;
drop policy if exists "public read projects" on portfolio_projects;
drop policy if exists "public read contacts" on contact_links;
drop policy if exists "public insert contact message" on contact_message;
drop policy if exists "dev read contact message" on contact_message;

drop policy if exists "dev write about settings" on about_settings;
drop policy if exists "dev write about photos" on about_photos;
drop policy if exists "dev write certifications" on certifications;
drop policy if exists "dev write categories" on portfolio_categories;
drop policy if exists "dev write projects" on portfolio_projects;
drop policy if exists "dev write contacts" on contact_links;

create policy "public read about settings" on about_settings
for select
using (true);

create policy "public read about photos" on about_photos
for select
using (is_active = true);

create policy "public read certifications" on certifications
for select
using (is_active = true);

create policy "public read categories" on portfolio_categories
for select
using (is_active = true);

create policy "public read projects" on portfolio_projects
for select
using (is_active = true);

create policy "public read contacts" on contact_links
for select
using (is_active = true);

create policy "public insert contact message" on contact_message
for insert
to anon, authenticated
with check (true);

create policy "dev read contact message" on contact_message
for select
to anon, authenticated
using (true);

-- Temporary development policy so AdminPage (browser + anon key) can write data.
-- IMPORTANT: tighten this in production by using Supabase Auth roles.
create policy "dev write about settings" on about_settings
for all
to anon, authenticated
using (true)
with check (true);

create policy "dev write about photos" on about_photos
for all
to anon, authenticated
using (true)
with check (true);

create policy "dev write certifications" on certifications
for all
to anon, authenticated
using (true)
with check (true);

create policy "dev write categories" on portfolio_categories
for all
to anon, authenticated
using (true)
with check (true);

create policy "dev write projects" on portfolio_projects
for all
to anon, authenticated
using (true)
with check (true);

create policy "dev write contacts" on contact_links
for all
to anon, authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('website-assets', 'website-assets', true)
on conflict (id)
do update set public = excluded.public;

drop policy if exists "public read website assets" on storage.objects;
drop policy if exists "dev write website assets" on storage.objects;

create policy "public read website assets" on storage.objects
for select
using (bucket_id = 'website-assets');

create policy "dev write website assets" on storage.objects
for all
to anon, authenticated
using (bucket_id = 'website-assets')
with check (bucket_id = 'website-assets');
