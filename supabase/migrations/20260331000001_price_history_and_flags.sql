-- Price history: log every price change
create table public.price_history (
  id uuid primary key default gen_random_uuid(),
  metal_id uuid not null references public.metals(id),
  old_price numeric(10,4) not null,
  new_price numeric(10,4) not null,
  changed_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.price_history enable row level security;

create policy "Authenticated users can read price history"
  on public.price_history for select
  to authenticated
  using (true);

create policy "Authenticated users can insert price history"
  on public.price_history for insert
  to authenticated
  with check (true);

create index idx_price_history_metal on public.price_history(metal_id, created_at desc);

-- Customer flag/blacklist
alter table public.customers
  add column is_flagged boolean not null default false,
  add column flag_reason text not null default '';
