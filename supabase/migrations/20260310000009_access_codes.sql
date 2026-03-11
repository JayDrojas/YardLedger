-- One-time access codes for pricing edits
create table public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_by uuid not null references public.users(id),
  is_used boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.access_codes enable row level security;

-- Only admins can create codes
create policy "Admins can insert access codes"
  on public.access_codes for insert
  with check (public.is_admin());

-- Authenticated users can read codes (to validate them)
create policy "Authenticated users can read access codes"
  on public.access_codes for select
  to authenticated
  using (true);

-- Authenticated users can mark codes as used
create policy "Authenticated users can update access codes"
  on public.access_codes for update
  to authenticated
  using (true);
