-- Metal catalog: admin-managed with pricing
create table public.metals (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price_per_lb numeric(10,4) not null default 0,
  is_active boolean not null default true,
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger metals_updated_at
  before update on public.metals
  for each row execute function public.update_updated_at();

-- RLS
alter table public.metals enable row level security;

-- Everyone can read active metals
create policy "All authenticated users can read metals"
  on public.metals for select
  to authenticated
  using (true);

-- Only admins can insert metals
create policy "Admins can insert metals"
  on public.metals for insert
  with check (public.is_admin());

-- Only admins can update metals (pricing, active status)
create policy "Admins can update metals"
  on public.metals for update
  using (public.is_admin());

-- Seed default metals
insert into public.metals (name, price_per_lb) values
  ('Steel', 0.08),
  ('Aluminum', 0.50),
  ('Copper', 3.50),
  ('Brass', 1.75),
  ('Stainless Steel', 0.35),
  ('Cast Iron', 0.06),
  ('Lead', 0.45),
  ('Zinc', 0.55);
