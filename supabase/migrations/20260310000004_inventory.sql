-- Inventory: running totals per metal
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  metal_id uuid not null unique references public.metals(id),
  metal_name text not null, -- denormalized
  weight numeric(12,2) not null default 0,
  avg_cost_per_lb numeric(10,4) not null default 0,
  updated_at timestamptz not null default now()
);

create trigger inventory_updated_at
  before update on public.inventory
  for each row execute function public.update_updated_at();

-- RLS
alter table public.inventory enable row level security;

-- All authenticated users can read inventory
create policy "All authenticated users can read inventory"
  on public.inventory for select
  to authenticated
  using (true);

-- Only admins can manually adjust inventory
create policy "Admins can update inventory"
  on public.inventory for update
  using (public.is_admin());

-- System can insert inventory rows (via trigger/function)
create policy "System can insert inventory"
  on public.inventory for insert
  to authenticated
  with check (true);

-- Auto-update inventory when a buy receipt line item is created
create or replace function public.update_inventory_on_buy()
returns trigger
language plpgsql
security definer
as $$
declare
  receipt_type text;
  current_weight numeric;
  current_avg_cost numeric;
  new_total_weight numeric;
  new_avg_cost numeric;
begin
  select r.type into receipt_type
    from public.receipts r where r.id = new.receipt_id;

  if receipt_type = 'buy' then
    select i.weight, i.avg_cost_per_lb
      into current_weight, current_avg_cost
      from public.inventory i where i.metal_id = new.metal_id;

    if current_weight is null then
      -- First purchase of this metal
      insert into public.inventory (metal_id, metal_name, weight, avg_cost_per_lb)
      values (new.metal_id, new.metal_name, new.weight, new.price_per_lb);
    else
      -- Weighted average cost
      new_total_weight := current_weight + new.weight;
      new_avg_cost := ((current_weight * current_avg_cost) + (new.weight * new.price_per_lb)) / new_total_weight;
      update public.inventory
        set weight = new_total_weight, avg_cost_per_lb = new_avg_cost, metal_name = new.metal_name
        where metal_id = new.metal_id;
    end if;
  end if;

  return new;
end;
$$;

create trigger line_item_updates_inventory
  after insert on public.line_items
  for each row execute function public.update_inventory_on_buy();
