-- Run this once in the Supabase SQL editor.
create table if not exists subscribers (
	email text primary key,
	confirmed_at timestamptz not null default now()
);

-- Required if you use the publishable (anon) key from server code.
-- The service role key bypasses these; the publishable key does not.
alter table subscribers enable row level security;

create policy "anyone can insert subscribers" on subscribers
	for insert with check (true);

create policy "anyone can read subscribers" on subscribers
	for select using (true);

create policy "anyone can delete subscribers" on subscribers
	for delete using (true);
