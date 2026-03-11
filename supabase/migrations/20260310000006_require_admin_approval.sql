-- New users start inactive — require admin approval before access
alter table public.users alter column is_active set default false;

-- Update the trigger function to explicitly set is_active = false
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (supabase_id, email, name, role, is_active)
  values (new.id, new.email, '', 'worker', false);
  return new;
end;
$$;

-- Admins can approve users (update is_active)
-- (Already covered by "Admins can update users" policy from migration 1)

-- Inactive users can still read their own profile (to check approval status)
-- (Already covered by "Users can read own profile" policy from migration 1)
