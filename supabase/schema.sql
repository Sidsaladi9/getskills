-- =============================================================
-- GETSKILLS — Complete Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- =============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";


-- =============================================================
-- 1. PROFILES
-- Extends auth.users — auto-created on signup via trigger
-- =============================================================
create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  name                    text,
  email                   text,
  avatar_url              text,
  bio                     text,
  website                 text,
  plan                    text not null default 'free' check (plan in ('free', 'pro')),
  -- Stripe (for billing integration)
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  pro_expires_at          timestamptz,
  -- Denormalized stats (updated by triggers)
  skills_submitted        integer not null default 0,
  total_installs          integer not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.profiles is 'Public user profiles, one per auth.users row';
comment on column public.profiles.plan is 'free or pro — drives paywall checks in the app';
comment on column public.profiles.stripe_customer_id is 'Stripe customer ID for billing';


-- =============================================================
-- 2. SKILLS
-- Core skills/prompts submitted by the community
-- =============================================================
create table if not exists public.skills (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique,
  title            text not null,
  description      text not null,
  long_description text,
  category         text not null check (category in (
    'productivity','coding','writing','data','design','devops','business','education'
  )),
  platform         text not null check (platform in (
    'claude-code','chatgpt','cursor','windsurf','copilot','universal'
  )),
  skill_code       text not null,
  tags             text[] not null default '{}',
  author_id        uuid references public.profiles(id) on delete set null,
  status           text not null default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason text,
  is_premium       boolean not null default false,
  is_featured      boolean not null default false,
  version          text not null default '1.0',
  -- Denormalized counters (fast reads; kept in sync by RPCs + triggers)
  install_count    integer not null default 0,   -- copies + downloads combined
  copy_count       integer not null default 0,
  download_count   integer not null default 0,
  view_count       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.skills is 'AI skills/prompts submitted and curated by the community';
comment on column public.skills.skill_code is 'Full markdown content — what users copy or download as .md';
comment on column public.skills.install_count is 'Total copies + downloads combined; used for popularity ranking';


-- =============================================================
-- 3. REVIEWS
-- One review per user per skill (upsert on conflict)
-- =============================================================
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  skill_id    uuid not null references public.skills(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (skill_id, user_id)
);

comment on table public.reviews is 'User ratings and comments for skills';


-- =============================================================
-- 4. SAVED SKILLS
-- User bookmarks
-- =============================================================
create table if not exists public.saved_skills (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  skill_id    uuid not null references public.skills(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, skill_id)
);

comment on table public.saved_skills is 'Skills saved/bookmarked by users';


-- =============================================================
-- 5. COLLECTIONS
-- User-curated named lists of skills (Pro feature)
-- =============================================================
create table if not exists public.collections (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  description text,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.collections is 'User-curated named collections of skills';


-- =============================================================
-- 6. COLLECTION SKILLS
-- Junction: many skills per collection
-- =============================================================
create table if not exists public.collection_skills (
  id              uuid primary key default uuid_generate_v4(),
  collection_id   uuid not null references public.collections(id) on delete cascade,
  skill_id        uuid not null references public.skills(id) on delete cascade,
  created_at      timestamptz not null default now(),
  unique (collection_id, skill_id)
);

comment on table public.collection_skills is 'Skills within a collection (junction table)';


-- =============================================================
-- 7. SKILL EVENTS
-- Raw analytics — every copy, download, and view is logged here
-- =============================================================
create table if not exists public.skill_events (
  id          uuid primary key default uuid_generate_v4(),
  skill_id    uuid not null references public.skills(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,  -- null = anonymous
  action      text not null check (action in ('copy', 'download', 'view')),
  platform    text,     -- which AI tool they're using (from their selection, optional)
  referrer    text,     -- page they came from
  created_at  timestamptz not null default now()
);

comment on table public.skill_events is 'Raw analytics: every copy/download/view event';


-- =============================================================
-- 8. DAILY SKILL STATS
-- Pre-aggregated per-skill per-day — powers sparkline charts
-- =============================================================
create table if not exists public.daily_skill_stats (
  id          uuid primary key default uuid_generate_v4(),
  skill_id    uuid not null references public.skills(id) on delete cascade,
  date        date not null,
  copies      integer not null default 0,
  downloads   integer not null default 0,
  views       integer not null default 0,
  unique (skill_id, date)
);

comment on table public.daily_skill_stats is 'Daily rollup of skill events — powers sparkline charts on skill detail page';


-- =============================================================
-- 9. PLATFORM STATS
-- Site-wide daily metrics — powers home page StatCards
-- =============================================================
create table if not exists public.platform_stats (
  id              uuid primary key default uuid_generate_v4(),
  date            date not null unique,
  total_skills    integer not null default 0,
  total_installs  integer not null default 0,
  total_users     integer not null default 0,
  new_skills      integer not null default 0,
  new_users       integer not null default 0,
  created_at      timestamptz not null default now()
);

comment on table public.platform_stats is 'Daily site-wide metrics powering home page stat cards (+12, +2.4K, etc.)';


-- =============================================================
-- VIEW: skills_with_stats
-- Primary view the app queries — approved skills with live stats
-- =============================================================
create or replace view public.skills_with_stats as
select
  s.id,
  s.slug,
  s.title,
  s.description,
  s.long_description,
  s.category,
  s.platform,
  s.skill_code,
  s.tags,
  s.author_id,
  p.name                                                        as author_name,
  p.avatar_url                                                  as author_avatar_url,
  (p.plan = 'pro' or p.skills_submitted >= 3)                  as author_verified,
  s.status,
  s.is_premium,
  s.is_featured,
  s.install_count,
  s.copy_count,
  s.download_count,
  s.view_count,
  s.version,
  s.source_name,
  s.source_url,
  coalesce(r.avg_rating, 0)::numeric(3,1)                      as avg_rating,
  coalesce(r.review_count, 0)::integer                         as review_count,
  s.created_at,
  s.updated_at
from public.skills s
left join public.profiles p on p.id = s.author_id
left join (
  select
    skill_id,
    round(avg(rating), 1) as avg_rating,
    count(*)              as review_count
  from public.reviews
  group by skill_id
) r on r.skill_id = s.id
where s.status = 'approved';

comment on view public.skills_with_stats is 'Approved skills with author info and live review aggregates — primary app query target';


-- =============================================================
-- INDEXES
-- =============================================================
create index if not exists skills_category_idx       on public.skills (category);
create index if not exists skills_platform_idx       on public.skills (platform);
create index if not exists skills_status_idx         on public.skills (status);
create index if not exists skills_featured_idx       on public.skills (is_featured) where is_featured = true;
create index if not exists skills_premium_idx        on public.skills (is_premium);
create index if not exists skills_author_idx         on public.skills (author_id);
create index if not exists skills_install_count_idx  on public.skills (install_count desc);
create index if not exists skills_tags_gin_idx       on public.skills using gin (tags);
create index if not exists skills_fts_idx            on public.skills
  using gin (to_tsvector('english', title || ' ' || coalesce(description, '')));

create index if not exists reviews_skill_id_idx      on public.reviews (skill_id);
create index if not exists saved_skills_user_idx     on public.saved_skills (user_id);
create index if not exists collections_user_idx      on public.collections (user_id);
create index if not exists skill_events_created_idx  on public.skill_events (created_at desc);
create index if not exists skill_events_skill_idx    on public.skill_events (skill_id);
create index if not exists daily_stats_date_idx      on public.daily_skill_stats (date desc);


-- =============================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================

-- Auto-create profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Auto-update updated_at on all tables
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists skills_updated_at      on public.skills;
drop trigger if exists profiles_updated_at    on public.profiles;
drop trigger if exists reviews_updated_at     on public.reviews;
drop trigger if exists collections_updated_at on public.collections;

create trigger skills_updated_at      before update on public.skills      for each row execute procedure public.set_updated_at();
create trigger profiles_updated_at    before update on public.profiles    for each row execute procedure public.set_updated_at();
create trigger reviews_updated_at     before update on public.reviews     for each row execute procedure public.set_updated_at();
create trigger collections_updated_at before update on public.collections for each row execute procedure public.set_updated_at();


-- Increment install_count — called by the app on copy/download
create or replace function public.increment_install_count(skill_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.skills set install_count = install_count + 1 where id = skill_id;
end;
$$;


-- Log a skill event, update denormalized counters, and roll up daily stats
-- Call this instead of increment_install_count for richer analytics
create or replace function public.log_skill_event(
  p_skill_id uuid,
  p_user_id  uuid,
  p_action   text,             -- 'copy' | 'download' | 'view'
  p_platform text default null,
  p_referrer text default null
)
returns void language plpgsql security definer as $$
begin
  -- 1. Raw event log
  insert into public.skill_events (skill_id, user_id, action, platform, referrer)
  values (p_skill_id, p_user_id, p_action, p_platform, p_referrer);

  -- 2. Update denormalized counters on skills table
  update public.skills set
    copy_count     = copy_count     + case when p_action = 'copy'     then 1 else 0 end,
    download_count = download_count + case when p_action = 'download' then 1 else 0 end,
    view_count     = view_count     + case when p_action = 'view'     then 1 else 0 end,
    install_count  = install_count  + case when p_action in ('copy','download') then 1 else 0 end
  where id = p_skill_id;

  -- 3. Upsert daily rollup for sparklines
  insert into public.daily_skill_stats (skill_id, date, copies, downloads, views)
  values (
    p_skill_id, current_date,
    case when p_action = 'copy'     then 1 else 0 end,
    case when p_action = 'download' then 1 else 0 end,
    case when p_action = 'view'     then 1 else 0 end
  )
  on conflict (skill_id, date) do update set
    copies    = daily_skill_stats.copies    + excluded.copies,
    downloads = daily_skill_stats.downloads + excluded.downloads,
    views     = daily_skill_stats.views     + excluded.views;
end;
$$;

comment on function public.log_skill_event is 'Log a skill event, update denormalized counters, and roll up daily stats in one call';


-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

alter table public.profiles          enable row level security;
alter table public.skills            enable row level security;
alter table public.reviews           enable row level security;
alter table public.saved_skills      enable row level security;
alter table public.collections       enable row level security;
alter table public.collection_skills enable row level security;
alter table public.skill_events      enable row level security;
alter table public.daily_skill_stats enable row level security;
alter table public.platform_stats    enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "profiles_select"          on public.profiles;
drop policy if exists "profiles_insert"          on public.profiles;
drop policy if exists "profiles_update"          on public.profiles;
drop policy if exists "skills_select"            on public.skills;
drop policy if exists "skills_insert"            on public.skills;
drop policy if exists "skills_update"            on public.skills;
drop policy if exists "skills_delete"            on public.skills;
drop policy if exists "reviews_select"           on public.reviews;
drop policy if exists "reviews_insert"           on public.reviews;
drop policy if exists "reviews_update"           on public.reviews;
drop policy if exists "reviews_delete"           on public.reviews;
drop policy if exists "saved_skills_select"      on public.saved_skills;
drop policy if exists "saved_skills_insert"      on public.saved_skills;
drop policy if exists "saved_skills_delete"      on public.saved_skills;
drop policy if exists "collections_select"       on public.collections;
drop policy if exists "collections_insert"       on public.collections;
drop policy if exists "collections_update"       on public.collections;
drop policy if exists "collections_delete"       on public.collections;
drop policy if exists "col_skills_select"        on public.collection_skills;
drop policy if exists "col_skills_insert"        on public.collection_skills;
drop policy if exists "col_skills_delete"        on public.collection_skills;
drop policy if exists "skill_events_insert"      on public.skill_events;
drop policy if exists "skill_events_select"      on public.skill_events;
drop policy if exists "daily_stats_select"       on public.daily_skill_stats;
drop policy if exists "platform_stats_select"    on public.platform_stats;

-- PROFILES
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- SKILLS
create policy "skills_select"  on public.skills for select using (status = 'approved' or auth.uid() = author_id);
create policy "skills_insert"  on public.skills for insert with check (auth.uid() = author_id);
create policy "skills_update"  on public.skills for update using (auth.uid() = author_id);
create policy "skills_delete"  on public.skills for delete using (auth.uid() = author_id and status = 'pending');

-- REVIEWS
create policy "reviews_select" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update" on public.reviews for update using (auth.uid() = user_id);
create policy "reviews_delete" on public.reviews for delete using (auth.uid() = user_id);

-- SAVED SKILLS
create policy "saved_skills_select" on public.saved_skills for select using (auth.uid() = user_id);
create policy "saved_skills_insert" on public.saved_skills for insert with check (auth.uid() = user_id);
create policy "saved_skills_delete" on public.saved_skills for delete using (auth.uid() = user_id);

-- COLLECTIONS
create policy "collections_select" on public.collections for select using (auth.uid() = user_id or is_public = true);
create policy "collections_insert" on public.collections for insert with check (auth.uid() = user_id);
create policy "collections_update" on public.collections for update using (auth.uid() = user_id);
create policy "collections_delete" on public.collections for delete using (auth.uid() = user_id);

-- COLLECTION SKILLS
create policy "col_skills_select" on public.collection_skills for select
  using (exists (select 1 from public.collections c where c.id = collection_id and (c.user_id = auth.uid() or c.is_public = true)));
create policy "col_skills_insert" on public.collection_skills for insert
  with check (exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid()));
create policy "col_skills_delete" on public.collection_skills for delete
  using (exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid()));

-- SKILL EVENTS (anonymous inserts allowed for public tracking)
create policy "skill_events_insert" on public.skill_events for insert with check (true);
create policy "skill_events_select" on public.skill_events for select using (auth.uid() = user_id);

-- READ-ONLY analytics
create policy "daily_stats_select"    on public.daily_skill_stats for select using (true);
create policy "platform_stats_select" on public.platform_stats    for select using (true);
