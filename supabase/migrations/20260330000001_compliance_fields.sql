-- Expand customers table with ID and compliance fields
alter table public.customers
  add column drivers_license text not null default '',
  add column dl_photo_uri text,
  add column address text not null default '',
  add column dob date,
  add column notes text not null default '';

-- Add vehicle and compliance fields to receipts
alter table public.receipts
  add column vehicle_plate text not null default '',
  add column vehicle_description text not null default '',
  add column seller_affirmed boolean not null default false;

-- Add restricted flag to metals (restricted = extra NM documentation required)
alter table public.metals
  add column is_restricted boolean not null default false;

-- Create storage bucket for customer ID photos
insert into storage.buckets (id, name, public)
  values ('customer-ids', 'customer-ids', false)
  on conflict (id) do nothing;

-- RLS for customer-ids bucket: authenticated users can upload and read
create policy "Authenticated users can upload customer IDs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'customer-ids');

create policy "Authenticated users can read customer IDs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'customer-ids');
