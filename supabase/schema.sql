-- Classroom/demo policies: the sample application has no login screen.
-- Do not put personal or real farm data in a publicly accessible project.
-- Before deploying, add Supabase Auth and restrict these policies per user.

create table if not exists public.agro_supplies (
  id text primary key,
  name text not null,
  category text not null,
  current_stock double precision not null default 0 check (current_stock >= 0),
  unit text not null,
  minimum_safe_stock double precision not null default 0 check (minimum_safe_stock >= 0),
  consumption_per_day double precision not null default 0 check (consumption_per_day >= 0),
  days_remaining integer not null default 99 check (days_remaining >= 0),
  target_talhoes jsonb not null default '[]'::jsonb,
  last_supplier text not null default '',
  status text not null check (status in ('optimal', 'warning', 'critical'))
);

alter table public.agro_supplies enable row level security;

drop policy if exists "Demo users can read supplies" on public.agro_supplies;
create policy "Demo users can read supplies"
  on public.agro_supplies for select to anon
  using (true);

drop policy if exists "Demo users can add supplies" on public.agro_supplies;
create policy "Demo users can add supplies"
  on public.agro_supplies for insert to anon
  with check (true);

drop policy if exists "Demo users can update supplies" on public.agro_supplies;
create policy "Demo users can update supplies"
  on public.agro_supplies for update to anon
  using (true) with check (true);

drop policy if exists "Demo users can delete supplies" on public.agro_supplies;
create policy "Demo users can delete supplies"
  on public.agro_supplies for delete to anon
  using (true);

grant select, insert, update, delete on table public.agro_supplies to anon;
