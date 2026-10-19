create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  slug text unique not null,
  full_name text not null,
  headline text,
  bio text,
  city text,
  country text,
  image_path text,
  is_public boolean default false not null,
  is_verified boolean default false not null,
  noindex boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Links table
create table public.links (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  label text not null,
  url text not null,
  position integer default 0 not null
);

-- Reports table
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  details text,
  status text default 'pending' not null,
  reporter_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.reports enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (is_public = true and is_verified = true and noindex = false);

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- Links policies
create policy "Links viewable for public profiles"
  on public.links for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = links.profile_id
      and profiles.is_public = true
      and profiles.is_verified = true
    )
  );

create policy "Users can manage own profile links"
  on public.links for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = links.profile_id
      and profiles.user_id = auth.uid()
    )
  );

-- Reports policies
create policy "Anyone can create reports"
  on public.reports for insert
  with check (true);

-- Storage bucket for profile images
insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

create policy "Public profile images are viewable by everyone"
  on storage.objects for select
  using (bucket_id = 'profile-images');

create policy "Users can upload own profile image"
  on storage.objects for insert
  with check (bucket_id = 'profile-images' and auth.role() = 'authenticated');

create policy "Users can update own profile image"
  on storage.objects for update
  using (bucket_id = 'profile-images' and auth.role() = 'authenticated');

create policy "Users can delete own profile image"
  on storage.objects for delete
  using (bucket_id = 'profile-images' and auth.role() = 'authenticated');
