-- Metal categories for grouping metals (e.g. Copper, Aluminum, Steel)
create table public.metal_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger metal_categories_updated_at
  before update on public.metal_categories
  for each row execute function public.update_updated_at();

-- RLS
alter table public.metal_categories enable row level security;

create policy "All authenticated users can read categories"
  on public.metal_categories for select
  to authenticated
  using (true);

create policy "Admins can insert categories"
  on public.metal_categories for insert
  with check (public.is_admin());

create policy "Admins can update categories"
  on public.metal_categories for update
  using (public.is_admin());

-- Add category_id FK to metals
alter table public.metals
  add column category_id uuid references public.metal_categories(id);

-- Seed categories and assign metals
insert into public.metal_categories (name, display_order) values
  ('Copper', 1),
  ('Aluminum', 2),
  ('Steel', 3),
  ('Brass', 4),
  ('Other', 5);

-- Assign existing metals to categories
update public.metals set category_id = (
  select id from public.metal_categories where name = 'Copper'
) where name = 'Copper';

update public.metals set category_id = (
  select id from public.metal_categories where name = 'Aluminum'
) where name = 'Aluminum';

update public.metals set category_id = (
  select id from public.metal_categories where name = 'Steel'
) where name in ('Steel', 'Stainless Steel');

update public.metals set category_id = (
  select id from public.metal_categories where name = 'Brass'
) where name = 'Brass';

update public.metals set category_id = (
  select id from public.metal_categories where name = 'Other'
) where name in ('Cast Iron', 'Lead', 'Zinc');
