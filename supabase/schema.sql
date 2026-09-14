create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  guests integer not null default 1,
  attendance text not null default 'attending',
  meal text not null default 'no-preference',
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

create policy "Anyone can insert RSVP submissions"
on public.rsvps
for insert
with check (true);

create policy "Only authenticated users can view RSVP submissions"
on public.rsvps
for select
using (auth.role() = 'authenticated');

create policy "Only authenticated users can update RSVP submissions"
on public.rsvps
for update
using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete RSVP submissions"
on public.rsvps
for delete
using (auth.role() = 'authenticated');

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
