-- DANGER: Drops existing Orbit tables to ensure a clean setup.
-- If you have important data in these tables, do not run this top section.
drop table if exists public.verification_logs;
drop table if exists public.events;
drop table if exists public.user_profiles;
drop table if exists public.series;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Series Table (Anime/Works)
create table public.series (
  id uuid default uuid_generate_v4() primary key,
  title_kr text not null,
  title_en text,
  thumbnail_url text,
  tags text[], -- Array of strings for genre/keywords
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Events/Info Table (The core content)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  series_id uuid references public.series(id),
  type text check (type in ('POPUP', 'CAFE', 'NEWS', 'GOODS')), -- Enum constraint
  title text not null,
  description text,
  location_name text,
  location_coords point, -- (x,y) coordinates if needed, or separate lat/long columns
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_official boolean default false,
  verification_level int default 3, -- 1: Verified, 2: Probable, 3: Testing
  source_url text, -- Original source link (Twitter/Web)
  image_urls text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. User Profiles (Extending Supabase Auth)
create table public.user_profiles (
  id uuid references auth.users not null primary key, -- Linked to Supabase Auth User ID
  username text,
  avatar_url text,
  favorite_series_ids uuid[], -- Array of Series IDs
  preferred_categories text[], -- e.g., ['POPUP', 'CAFE']
  residence_region text, -- e.g., 'Seoul/Hongdae'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Verification Logs (Trust mechanism)
create table public.verification_logs (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references public.user_profiles(id) not null,
  vote_type text check (vote_type in ('UP', 'DOWN')), -- 'UP' verifies, 'DOWN' disputes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Row Level Security) - Basic Setup
alter table public.series enable row level security;
alter table public.events enable row level security;
alter table public.user_profiles enable row level security;
alter table public.verification_logs enable row level security;

-- Allow read access to everyone for public data
create policy "Public series are viewable by everyone" on public.series for select using (true);
create policy "Public events are viewable by everyone" on public.events for select using (true);

-- Allow users to view profiles
create policy "Public profiles are viewable by everyone" on public.user_profiles for select using (true);

-- Allow authenticated users to update their own profile
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);

-- Allow authenticated users to insert verification logs
create policy "Authenticated users can vote" on public.verification_logs for insert with check (auth.role() = 'authenticated');
