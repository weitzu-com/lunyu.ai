-- Auth users and credential storage are managed by Supabase Auth.
create table if not exists public.game_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null check (jsonb_typeof(progress) = 'object' and octet_length(progress::text) <= 32768),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.game_progress enable row level security;
revoke all on public.game_progress from anon;
grant select, insert, update on public.game_progress to authenticated;
create policy "Read own journey" on public.game_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own journey" on public.game_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own journey" on public.game_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Compare-and-swap is atomic even when two devices save simultaneously.
create or replace function public.save_game_progress(next_progress jsonb, expected_revision integer)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare saved public.game_progress; owner_id uuid := auth.uid();
begin
  if owner_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if expected_revision is null then
    insert into public.game_progress(user_id, progress) values (owner_id, next_progress)
    on conflict (user_id) do nothing returning * into saved;
  else
    update public.game_progress set progress = next_progress, revision = revision + 1, updated_at = now()
    where user_id = owner_id and revision = expected_revision returning * into saved;
  end if;
  if saved.user_id is null then
    select * into saved from public.game_progress where user_id = owner_id;
    return jsonb_build_object('conflict', true, 'save', case when saved.user_id is null then null else
      jsonb_build_object('progress', saved.progress, 'revision', saved.revision, 'updatedAt', saved.updated_at) end);
  end if;
  return jsonb_build_object('conflict', false, 'save', jsonb_build_object('progress', saved.progress, 'revision', saved.revision, 'updatedAt', saved.updated_at));
end;
$$;
revoke all on function public.save_game_progress(jsonb, integer) from public, anon;
grant execute on function public.save_game_progress(jsonb, integer) to authenticated;

create table if not exists public.account_rate_limits (
  bucket_key text primary key,
  attempts integer not null,
  expires_at timestamptz not null
);
create index if not exists account_rate_limits_expiry on public.account_rate_limits(expires_at);
alter table public.account_rate_limits enable row level security;
revoke all on public.account_rate_limits from public, anon, authenticated;

create or replace function public.check_account_rate_limit(bucket_keys text[], attempt_limit integer, window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare bucket text; used integer; allowed boolean := true;
begin
  delete from public.account_rate_limits where expires_at < now();
  foreach bucket in array bucket_keys loop
    insert into public.account_rate_limits(bucket_key, attempts, expires_at)
    values (bucket, 1, now() + make_interval(secs => window_seconds))
    on conflict (bucket_key) do update set attempts = public.account_rate_limits.attempts + 1
    returning attempts into used;
    if used > attempt_limit then allowed := false; end if;
  end loop;
  return allowed;
end;
$$;
revoke all on function public.check_account_rate_limit(text[], integer, integer) from public, anon, authenticated;
grant execute on function public.check_account_rate_limit(text[], integer, integer) to service_role;
