-- Sales: outgoing metal sales with profit tracking
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  metal_id uuid not null references public.metals(id),
  metal_name text not null, -- denormalized
  weight numeric(10,2) not null,
  sale_price_per_lb numeric(10,4) not null,
  cost_basis_per_lb numeric(10,4) not null,
  total_revenue numeric(12,2) not null,
  profit numeric(12,2) not null,
  buyer_name text,
  worker_id uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger sales_updated_at
  before update on public.sales
  for each row execute function public.update_updated_at();

-- RLS
alter table public.sales enable row level security;

-- Workers can read their own sales; admins can read all
create policy "Workers read own sales"
  on public.sales for select
  using (
    worker_id in (select id from public.users where supabase_id = auth.uid())
    or public.is_admin()
  );

-- Authenticated users can create sales
create policy "Authenticated users can create sales"
  on public.sales for insert
  to authenticated
  with check (true);

-- Auto-deduct inventory on sale
create or replace function public.update_inventory_on_sale()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.inventory
    set weight = weight - new.weight
    where metal_id = new.metal_id;
  return new;
end;
$$;

create trigger sale_deducts_inventory
  after insert on public.sales
  for each row execute function public.update_inventory_on_sale();

-- Indexes
create index idx_sales_worker_id on public.sales(worker_id);
create index idx_sales_created_at on public.sales(created_at desc);
create index idx_sales_metal_id on public.sales(metal_id);
