-- Run this once in the Supabase SQL editor.
create table if not exists subscribers (
	email text primary key,
	confirmed_at timestamptz not null default now()
);
