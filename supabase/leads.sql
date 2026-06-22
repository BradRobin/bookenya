create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  property_id text not null,
  property_name text not null,
  check_in date,
  check_out date,
  adults integer not null default 1,
  children integer not null default 0,
  rooms integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Allow public lead submissions"
  on public.leads
  for insert
  to anon
  with check (true);
