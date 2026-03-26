drop index if exists public.waitlist_email_unique_idx;

drop policy if exists "anon_select_waitlist" on public.waitlist;
drop policy if exists "anon_insert_waitlist" on public.waitlist;

alter table public.waitlist disable row level security;
