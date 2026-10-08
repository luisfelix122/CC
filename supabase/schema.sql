-- NutriDiario: ejecutar en Supabase > SQL Editor
create table if not exists public.goals (
  device_id text primary key,
  kcal_goal int not null default 2000 check (kcal_goal > 0),
  water_goal_ml int not null default 2000 check (water_goal_ml > 0),
  reminder_minutes int not null default 60 check (reminder_minutes > 0),
  reminders_on boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  eaten_at timestamptz not null default now(),
  kind text not null check (kind in ('label', 'plate')),
  name text not null,
  description text,
  items jsonb not null default '[]'::jsonb,
  quantity_g numeric,
  kcal numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0
);
create index if not exists food_entries_device_time on public.food_entries (device_id, eaten_at);

create table if not exists public.water_entries (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  drank_at timestamptz not null default now(),
  ml int not null check (ml > 0)
);
create index if not exists water_entries_device_time on public.water_entries (device_id, drank_at);

-- Prototipo sin login (ver docs/decisiones/0002): acceso anon completo.
alter table public.goals enable row level security;
alter table public.food_entries enable row level security;
alter table public.water_entries enable row level security;

drop policy if exists anon_all_goals on public.goals;
create policy anon_all_goals on public.goals for all to anon using (true) with check (true);
drop policy if exists anon_all_food on public.food_entries;
create policy anon_all_food on public.food_entries for all to anon using (true) with check (true);
drop policy if exists anon_all_water on public.water_entries;
create policy anon_all_water on public.water_entries for all to anon using (true) with check (true);

grant select, insert, update, delete on public.goals, public.food_entries, public.water_entries to anon;
