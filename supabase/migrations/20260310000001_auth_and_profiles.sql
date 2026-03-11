-- Users/profiles table (extends Supabase auth.users)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  supabase_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'worker' check (role in ('admin', 'worker')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a user profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (supabase_id, email, name, role)
  values (new.id, new.email, '', 'worker');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on any row change
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at();

-- Helper to check admin role without triggering RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.users
    where supabase_id = auth.uid() and role = 'admin'
  );
$$;

-- RLS
alter table public.users enable row level security;

-- Workers can read their own profile
create policy "Users can read own profile"
  on public.users for select
  using (supabase_id = auth.uid());

-- Admins can read all users
create policy "Admins can read all users"
  on public.users for select
  using (public.is_admin());

-- Admins can update any user (role, is_active, etc.)
create policy "Admins can update users"
  on public.users for update
  using (public.is_admin());

-- Users can update their own name
create policy "Users can update own name"
  on public.users for update
  using (supabase_id = auth.uid())
  with check (supabase_id = auth.uid());
