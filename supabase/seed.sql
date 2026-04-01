insert into private.bootstrap_super_admins (email)
values ('admin@local.dev')
on conflict (email) do nothing;

insert into public.role_assignments (user_id, role, scope_type, scope_id)
select
  auth_user.id,
  'super_admin'::public.app_role,
  'global',
  null
from auth.users as auth_user
join private.bootstrap_super_admins as bootstrap
  on bootstrap.email = lower(auth_user.email)
on conflict (user_id, role, scope_type, scope_id) do nothing;
