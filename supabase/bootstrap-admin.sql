-- 1. Create yetisikayet@proton.me in Supabase Dashboard > Authentication > Users.
-- 2. Set the password in the dashboard and confirm the email there.
-- 3. Run this file as the database owner. It never creates a public signup endpoint.
do $$
declare v_id uuid;
begin
  select id into v_id from auth.users
    where lower(email)='yetisikayet@proton.me' and email_confirmed_at is not null;
  if v_id is null then
    raise exception 'Create and confirm yetisikayet@proton.me in Supabase Auth first.';
  end if;
  insert into yetisikayet_private.moderators(user_id) values(v_id) on conflict do nothing;
end;
$$;
