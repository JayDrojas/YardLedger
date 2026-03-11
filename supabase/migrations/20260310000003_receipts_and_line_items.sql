-- Receipts: one per customer visit
create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  customer_name text not null,
  customer_phone text not null default '',
  type text not null check (type in ('buy', 'sell')),
  subtotal numeric(12,2) not null default 0,
  signature_uri text,
  worker_id uuid not null references public.users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger receipts_updated_at
  before update on public.receipts
  for each row execute function public.update_updated_at();

-- Auto-generate receipt numbers: YL-YYYYMMDD-NNNN
create or replace function public.generate_receipt_number()
returns trigger
language plpgsql
as $$
declare
  today_str text;
  seq int;
begin
  today_str := to_char(now(), 'YYYYMMDD');
  select count(*) + 1 into seq
    from public.receipts
    where receipt_number like 'YL-' || today_str || '-%';
  new.receipt_number := 'YL-' || today_str || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$;

create trigger receipts_auto_number
  before insert on public.receipts
  for each row
  when (new.receipt_number is null or new.receipt_number = '')
  execute function public.generate_receipt_number();

-- Line items: individual metals on a receipt
create table public.line_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.receipts(id) on delete cascade,
  metal_id uuid not null references public.metals(id),
  metal_name text not null, -- denormalized
  weight numeric(10,2) not null,
  price_per_lb numeric(10,4) not null,
  original_price_per_lb numeric(10,4) not null,
  is_price_override boolean not null default false,
  override_approved_by uuid references public.users(id),
  total numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger line_items_updated_at
  before update on public.line_items
  for each row execute function public.update_updated_at();

-- RLS
alter table public.receipts enable row level security;
alter table public.line_items enable row level security;

-- Workers can read their own receipts; admins can read all
create policy "Workers read own receipts"
  on public.receipts for select
  using (
    worker_id in (select id from public.users where supabase_id = auth.uid())
    or public.is_admin()
  );

-- Authenticated users can create receipts
create policy "Authenticated users can create receipts"
  on public.receipts for insert
  to authenticated
  with check (true);

-- Line items follow receipt access
create policy "Line items follow receipt access"
  on public.line_items for select
  using (
    exists (
      select 1 from public.receipts r
      where r.id = receipt_id
        and (
          r.worker_id in (select id from public.users where supabase_id = auth.uid())
          or public.is_admin()
        )
    )
  );

-- Authenticated users can create line items
create policy "Authenticated users can create line items"
  on public.line_items for insert
  to authenticated
  with check (true);

-- Indexes
create index idx_receipts_worker_id on public.receipts(worker_id);
create index idx_receipts_created_at on public.receipts(created_at desc);
create index idx_line_items_receipt_id on public.line_items(receipt_id);
create index idx_line_items_metal_id on public.line_items(metal_id);
