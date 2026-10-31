-- Run as the database owner in Supabase SQL Editor, or use `supabase db push`.
-- No passwords or service keys belong in this file.
begin;

create schema if not exists yetisikayet_private;
revoke all on schema yetisikayet_private from public, anon, authenticated;

create table if not exists yetisikayet_private.moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists yetisikayet_private.provinces (name text primary key);
insert into yetisikayet_private.provinces(name) values
  ('Adana'),
  ('Adıyaman'),
  ('Afyonkarahisar'),
  ('Ağrı'),
  ('Aksaray'),
  ('Amasya'),
  ('Ankara'),
  ('Antalya'),
  ('Ardahan'),
  ('Artvin'),
  ('Aydın'),
  ('Balıkesir'),
  ('Bartın'),
  ('Batman'),
  ('Bayburt'),
  ('Bilecik'),
  ('Bingöl'),
  ('Bitlis'),
  ('Bolu'),
  ('Burdur'),
  ('Bursa'),
  ('Çanakkale'),
  ('Çankırı'),
  ('Çorum'),
  ('Denizli'),
  ('Diyarbakır'),
  ('Düzce'),
  ('Edirne'),
  ('Elazığ'),
  ('Erzincan'),
  ('Erzurum'),
  ('Eskişehir'),
  ('Gaziantep'),
  ('Giresun'),
  ('Gümüşhane'),
  ('Hakkâri'),
  ('Hatay'),
  ('Iğdır'),
  ('Isparta'),
  ('İstanbul'),
  ('İzmir'),
  ('Kahramanmaraş'),
  ('Karabük'),
  ('Karaman'),
  ('Kars'),
  ('Kastamonu'),
  ('Kayseri'),
  ('Kırıkkale'),
  ('Kırklareli'),
  ('Kırşehir'),
  ('Kilis'),
  ('Kocaeli'),
  ('Konya'),
  ('Kütahya'),
  ('Malatya'),
  ('Manisa'),
  ('Mardin'),
  ('Mersin'),
  ('Muğla'),
  ('Muş'),
  ('Nevşehir'),
  ('Niğde'),
  ('Ordu'),
  ('Osmaniye'),
  ('Rize'),
  ('Sakarya'),
  ('Samsun'),
  ('Siirt'),
  ('Sinop'),
  ('Sivas'),
  ('Şanlıurfa'),
  ('Şırnak'),
  ('Tekirdağ'),
  ('Tokat'),
  ('Trabzon'),
  ('Tunceli'),
  ('Uşak'),
  ('Van'),
  ('Yalova'),
  ('Yozgat'),
  ('Zonguldak')
on conflict do nothing;

create table if not exists yetisikayet_private.records (
  id uuid primary key,
  slug text unique not null,
  kind text not null check (kind in ('complaint','reply')),
  parent_id uuid references yetisikayet_private.records(id),
  status text not null check (status in ('pending','published','rejected')),
  version integer not null check (version > 0),
  data jsonb not null check (jsonb_typeof(data)='object'),
  original_data jsonb not null,
  created_at timestamptz not null default now(),
  check ((kind='complaint' and parent_id is null) or (kind='reply' and parent_id is not null)),
  check ((data->>'id')::uuid=id and data->>'slug'=slug and data->>'kind'=kind and data->>'status'=status and (data->>'version')::integer=version),
  check (char_length(data->>'title') between 10 and 120),
  check (char_length(data->>'narrative') between 20 and 5000),
  check (status<>'published' or data->>'evidenceReviewed'='true' or data->>'isExample'='true')
);
create index if not exists ys_records_status_kind on yetisikayet_private.records(status,kind,created_at desc);
create index if not exists ys_records_parent on yetisikayet_private.records(parent_id);
create table if not exists yetisikayet_private.revisions (
  id bigint generated always as identity primary key,
  record_id uuid not null references yetisikayet_private.records(id),
  actor_id uuid references auth.users(id),
  saved_at timestamptz not null default now(),
  snapshot jsonb not null
);
create table if not exists yetisikayet_private.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists yetisikayet_private.rate_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);

alter table yetisikayet_private.moderators enable row level security;
alter table yetisikayet_private.provinces enable row level security;
alter table yetisikayet_private.records enable row level security;
alter table yetisikayet_private.revisions enable row level security;
alter table yetisikayet_private.settings enable row level security;
alter table yetisikayet_private.rate_limits enable row level security;
revoke all on all tables in schema yetisikayet_private from public,anon,authenticated;
revoke all on all sequences in schema yetisikayet_private from public,anon,authenticated;
-- No direct table policies: access is through the explicitly granted RPCs below.
-- SECURITY DEFINER is intentional: it crosses the private-schema/RLS boundary.
-- Every elevated RPC fixes search_path and either restricts output or verifies auth.uid().

create or replace function public.ys_is_moderator()
returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from yetisikayet_private.moderators where user_id=(select auth.uid())); $$;

create or replace function yetisikayet_private.require_moderator()
returns void language plpgsql stable security definer set search_path=''
as $$ begin
  if not public.ys_is_moderator() then raise exception 'Moderator required' using errcode='42501'; end if;
end; $$;

create or replace function yetisikayet_private.public_record(p_data jsonb)
returns jsonb language sql stable set search_path=''
as $$
  select p_data || jsonb_build_object('adminNotes',coalesce((
    select jsonb_agg(n) from jsonb_array_elements(coalesce(p_data->'adminNotes','[]'::jsonb)) n
    where n->>'public'='true'
  ),'[]'::jsonb));
$$;

create or replace function public.ys_read_published(p_slug text default null)
returns jsonb language sql stable security definer set search_path=''
as $$
  select coalesce(jsonb_agg(yetisikayet_private.public_record(r.data) order by r.created_at desc),'[]'::jsonb)
  from yetisikayet_private.records r
  left join yetisikayet_private.records p on p.id=r.parent_id
  where r.status='published'
    and (r.kind='complaint' or (p.kind='complaint' and p.status='published'))
    and (p_slug is null or (r.kind='complaint' and r.slug=p_slug) or (r.kind='reply' and p.slug=p_slug));
$$;

create or replace function public.ys_admin_list_records()
returns jsonb language plpgsql stable security definer set search_path=''
as $$ begin
  perform yetisikayet_private.require_moderator();
  return (select coalesce(jsonb_agg(data order by created_at desc),'[]'::jsonb) from yetisikayet_private.records);
end; $$;
create or replace function public.ys_admin_get_record(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path=''
as $$ begin
  perform yetisikayet_private.require_moderator();
  return (select data from yetisikayet_private.records where id=p_id);
end; $$;

create or replace function yetisikayet_private.validate_record(p_data jsonb)
returns void language plpgsql set search_path=''
as $$ declare n jsonb; begin
  if jsonb_typeof(p_data)<>'object'
    or coalesce(char_length(btrim(p_data->>'title')),0) not between 10 and 120
    or coalesce(char_length(btrim(p_data->>'narrative')),0) not between 20 and 5000
    then raise exception 'Invalid text' using errcode='22023'; end if;
  if p_data->>'kind'='complaint' then
    if char_length(btrim(p_data->>'narrative'))<100
      or coalesce(p_data->>'staffType','') not in ('affiliate','headquarters')
      or not exists(select 1 from yetisikayet_private.provinces where name=p_data->>'city')
      or char_length(coalesce(p_data->>'period',''))>100
      then raise exception 'Invalid worker data' using errcode='22023'; end if;
  elsif p_data->>'kind'='reply' then
    if coalesce(char_length(btrim(p_data->>'name')),0) not between 2 and 120
      or coalesce(char_length(btrim(p_data->>'role')),0) not between 2 and 120
      then raise exception 'Invalid representative data' using errcode='22023'; end if;
  else raise exception 'Invalid record kind' using errcode='22023'; end if;
  if jsonb_typeof(p_data->'evidenceReviewed') is distinct from 'boolean'
    or jsonb_typeof(p_data->'adminNotes') is distinct from 'array'
    or jsonb_array_length(p_data->'adminNotes')>20
    then raise exception 'Invalid review data' using errcode='22023'; end if;
  for n in select value from jsonb_array_elements(p_data->'adminNotes') loop
    if jsonb_typeof(n)<>'object' or coalesce(n->>'id','')='' or char_length(n->>'id')>100
      or jsonb_typeof(n->'public') is distinct from 'boolean'
      or coalesce(n->>'text','')='' and coalesce(n->>'url','')=''
      or char_length(coalesce(n->>'text',''))>3000 or char_length(coalesce(n->>'url',''))>2000
      or coalesce(n->>'url','')<>'' and (n->>'url' !~ '^https://[^/@[:space:]]+[.][^/@[:space:]]+(/|$)' or n->>'url' ~ '[[:cntrl:][:space:]]')
      then raise exception 'Invalid admin note' using errcode='22023'; end if;
  end loop;
end; $$;

create or replace function public.ys_submit_content(p_kind text,p_payload jsonb,p_parent_id uuid default null)
returns uuid language plpgsql security definer set search_path=''
as $$ declare
  v_id uuid=gen_random_uuid(); v_now text=to_char(clock_timestamp() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
  v_data jsonb; v_parent yetisikayet_private.records%rowtype;
begin
  if p_kind='reply' then
    select * into v_parent from yetisikayet_private.records where id=p_parent_id and kind='complaint' and status='published' for share;
    if not found then raise exception 'Published complaint not found' using errcode='22023'; end if;
    v_data=jsonb_build_object('id',v_id,'slug','yanit-'||v_id,'kind','reply','parentId',p_parent_id,
      'title',v_parent.data->>'title','name',btrim(p_payload->>'name'),'role',btrim(p_payload->>'role'),'narrative',btrim(p_payload->>'reply'));
  elsif p_kind='complaint' and p_parent_id is null then
    v_data=jsonb_strip_nulls(jsonb_build_object('id',v_id,'slug','sikayet-'||v_id,'kind','complaint',
      'title',btrim(p_payload->>'title'),'narrative',btrim(p_payload->>'narrative'),'city',p_payload->>'city','staffType',p_payload->>'staffType','period',btrim(p_payload->>'period')));
  else raise exception 'Invalid submission' using errcode='22023'; end if;
  -- Never trust status, notes, IDs, example flags or review flags from the applicant.
  v_data=v_data||jsonb_build_object('status','pending','evidenceReviewed',false,'adminNotes','[]'::jsonb,'createdAt',v_now,'updatedAt',v_now,'version',1,'isExample',false);
  perform yetisikayet_private.validate_record(v_data);
  insert into yetisikayet_private.records(id,slug,kind,parent_id,status,version,data,original_data)
    values(v_id,v_data->>'slug',p_kind,p_parent_id,'pending',1,v_data,v_data);
  return v_id;
end; $$;

create or replace function public.ys_admin_save_record(p_id uuid,p_expected_version integer,p_changes jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$ declare v_old yetisikayet_private.records%rowtype; v_data jsonb; v_status text; v_now text=to_char(clock_timestamp() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'); begin
  perform yetisikayet_private.require_moderator();
  select * into v_old from yetisikayet_private.records where id=p_id for update;
  if not found then raise exception 'Record not found' using errcode='22023'; end if;
  if v_old.version<>p_expected_version then raise exception 'Version conflict' using errcode='40001'; end if;
  v_status=p_changes->>'status';
  if v_status is null or v_status not in ('pending','published','rejected') then raise exception 'Invalid status' using errcode='22023'; end if;
  v_data=v_old.data||jsonb_build_object('title',btrim(p_changes->>'title'),'narrative',btrim(p_changes->>'narrative'),
    'status',v_status,'evidenceReviewed',p_changes->'evidenceReviewed','adminNotes',p_changes->'adminNotes','updatedAt',v_now,'version',v_old.version+1);
  if v_old.kind='complaint' then
    v_data=v_data||jsonb_build_object('city',p_changes->>'city','staffType',p_changes->>'staffType','period',coalesce(btrim(p_changes->>'period'),''));
  else
    v_data=v_data||jsonb_build_object('name',btrim(p_changes->>'name'),'role',btrim(p_changes->>'role'));
  end if;
  perform yetisikayet_private.validate_record(v_data);
  if v_status='published' then
    if coalesce(v_data->>'isExample','false')<>'true' and v_data->>'evidenceReviewed'<>'true' then raise exception 'Evidence review required' using errcode='22023'; end if;
    if v_old.kind='reply' then
      perform 1 from yetisikayet_private.records where id=v_old.parent_id and status='published' for share;
      if not found then raise exception 'Parent complaint not published' using errcode='22023'; end if;
    end if;
    if not v_data ? 'publishedAt' then v_data=v_data||jsonb_build_object('publishedAt',v_now); end if;
  end if;
  insert into yetisikayet_private.revisions(record_id,actor_id,snapshot) values(p_id,auth.uid(),v_old.data);
  update yetisikayet_private.records set data=v_data,status=v_status,version=v_old.version+1 where id=p_id;
  return v_data;
end; $$;

create or replace function public.ys_read_playlist()
returns jsonb language sql stable security definer set search_path=''
as $$ select value from yetisikayet_private.settings where key='music'; $$;

create or replace function public.ys_admin_save_playlist(p_tracks jsonb)
returns void language plpgsql security definer set search_path=''
as $$ declare t jsonb; begin
  perform yetisikayet_private.require_moderator();
  if jsonb_typeof(p_tracks) is distinct from 'array' then raise exception 'Invalid playlist' using errcode='22023'; end if;
  if jsonb_array_length(p_tracks) not between 1 and 30 then raise exception 'Invalid playlist length' using errcode='22023'; end if;
  for t in select value from jsonb_array_elements(p_tracks) loop
    if coalesce(t->>'id','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      or coalesce(t->>'videoId','') !~ '^[A-Za-z0-9_-]{11}$'
      or coalesce(char_length(btrim(t->>'title')),0) not between 1 and 100
      or jsonb_typeof(t->'startSeconds') is distinct from 'number'
      or coalesce(t->>'startSeconds','') !~ '^[0-9]{1,5}$'
      then raise exception 'Invalid track' using errcode='22023'; end if;
    if (t->>'startSeconds')::integer>86400 then raise exception 'Invalid start second' using errcode='22023'; end if;
  end loop;
  if (select count(distinct value->>'id') from jsonb_array_elements(p_tracks))<>jsonb_array_length(p_tracks) then raise exception 'Duplicate track ID' using errcode='22023'; end if;
  insert into yetisikayet_private.settings(key,value) values('music',jsonb_build_object('tracks',p_tracks))
    on conflict(key) do update set value=excluded.value,updated_at=now();
end; $$;

insert into yetisikayet_private.settings(key,value) values('music',
  '{"tracks":[{"id":"00000000-0000-4000-8000-000000000001","videoId":"5ftitAfWgWI","title":"Çalışma müziği","startSeconds":0}]}'::jsonb)
  on conflict(key) do nothing;

create or replace function public.ys_take_rate_limit(p_key text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=''
as $$ declare v_count integer; begin
  if p_key !~ '^[a-f0-9]{64}$' or p_limit not between 1 and 1000 or p_window_seconds not between 1 and 86400 then raise exception 'Invalid rate limit' using errcode='22023'; end if;
  insert into yetisikayet_private.rate_limits as limits(key,count,expires_at) values(p_key,1,now()+make_interval(secs=>p_window_seconds))
    on conflict(key) do update set
      count=case when limits.expires_at<=now() then 1 else least(limits.count+1,p_limit+1) end,
      expires_at=case when limits.expires_at<=now() then now()+make_interval(secs=>p_window_seconds) else limits.expires_at end
    returning count into v_count;
  return v_count<=p_limit;
end; $$;

-- Postgres grants EXECUTE to PUBLIC by default: explicitly remove it per RPC.
revoke all on all functions in schema yetisikayet_private from public,anon,authenticated;
revoke all on function public.ys_is_moderator() from public,anon,authenticated;
revoke all on function public.ys_read_published(text) from public,anon,authenticated;
revoke all on function public.ys_admin_list_records() from public,anon,authenticated;
revoke all on function public.ys_admin_get_record(uuid) from public,anon,authenticated;
revoke all on function public.ys_submit_content(text,jsonb,uuid) from public,anon,authenticated;
revoke all on function public.ys_admin_save_record(uuid,integer,jsonb) from public,anon,authenticated;
revoke all on function public.ys_read_playlist() from public,anon,authenticated;
revoke all on function public.ys_admin_save_playlist(jsonb) from public,anon,authenticated;
revoke all on function public.ys_take_rate_limit(text,integer,integer) from public,anon,authenticated;

grant execute on function public.ys_read_published(text),public.ys_read_playlist() to anon,authenticated;
grant execute on function public.ys_is_moderator(),public.ys_admin_list_records(),public.ys_admin_get_record(uuid),public.ys_admin_save_record(uuid,integer,jsonb),public.ys_admin_save_playlist(jsonb) to authenticated;
grant execute on function public.ys_submit_content(text,jsonb,uuid),public.ys_take_rate_limit(text,integer,integer) to service_role;

commit;
