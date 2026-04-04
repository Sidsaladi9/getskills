-- ============================================
-- GetSkills Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Skills
create table public.skills (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  category text not null,
  platform text not null,
  skill_code text not null,
  tags text[] not null default '{}',
  is_premium boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  author_id uuid references public.profiles(id) on delete set null,
  install_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills enable row level security;

create policy "Approved skills are viewable by everyone"
  on public.skills for select using (status = 'approved');

create policy "Users can insert their own skills"
  on public.skills for insert with check (auth.uid() = author_id);

create policy "Users can update their own skills"
  on public.skills for update using (auth.uid() = author_id);

-- Indexes for search and filtering
create index skills_category_idx on public.skills(category);
create index skills_platform_idx on public.skills(platform);
create index skills_status_idx on public.skills(status);
create index skills_slug_idx on public.skills(slug);
create index skills_install_count_idx on public.skills(install_count desc);
create index skills_tags_idx on public.skills using gin(tags);

-- Full text search
alter table public.skills add column fts tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) stored;

create index skills_fts_idx on public.skills using gin(fts);

-- 3. Saved Skills (bookmarks)
create table public.saved_skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, skill_id)
);

alter table public.saved_skills enable row level security;

create policy "Users can view their own saved skills"
  on public.saved_skills for select using (auth.uid() = user_id);

create policy "Users can save skills"
  on public.saved_skills for insert with check (auth.uid() = user_id);

create policy "Users can unsave skills"
  on public.saved_skills for delete using (auth.uid() = user_id);

-- 4. Collections
create table public.collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collections enable row level security;

create policy "Users can view their own collections"
  on public.collections for select using (auth.uid() = user_id);

create policy "Users can create collections"
  on public.collections for insert with check (auth.uid() = user_id);

create policy "Users can update their own collections"
  on public.collections for update using (auth.uid() = user_id);

create policy "Users can delete their own collections"
  on public.collections for delete using (auth.uid() = user_id);

-- 5. Collection Skills (junction)
create table public.collection_skills (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references public.collections(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  added_at timestamptz not null default now(),
  unique(collection_id, skill_id)
);

alter table public.collection_skills enable row level security;

create policy "Users can view their collection skills"
  on public.collection_skills for select
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "Users can add to their collections"
  on public.collection_skills for insert
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "Users can remove from their collections"
  on public.collection_skills for delete
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

-- 6. Reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  skill_id uuid references public.skills(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(skill_id, user_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete using (auth.uid() = user_id);

-- 7. Skill installs tracking (increment on copy)
create or replace function public.increment_install_count(skill_id uuid)
returns void as $$
begin
  update public.skills
  set install_count = install_count + 1
  where id = skill_id;
end;
$$ language plpgsql security definer;

-- 8. View for skills with aggregated stats
create or replace view public.skills_with_stats as
select
  s.*,
  coalesce(r.avg_rating, 0) as avg_rating,
  coalesce(r.review_count, 0) as review_count,
  p.name as author_name,
  p.avatar_url as author_avatar,
  p.is_verified as author_verified
from public.skills s
left join (
  select skill_id, avg(rating)::numeric(2,1) as avg_rating, count(*) as review_count
  from public.reviews
  group by skill_id
) r on r.skill_id = s.id
left join public.profiles p on p.id = s.author_id
where s.status = 'approved';
