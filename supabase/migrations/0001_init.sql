-- ============================================================================
-- Scuba India — initial schema (SPEC §7)
-- Postgres / Supabase.  Public read on content tables; writes only for
-- authenticated admin.  Bookings are insert-by-anyone (enquiry form) but
-- read/manage only by admin.
-- ============================================================================

-- ---------- extensions ------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------- helper: updated_at trigger -------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================================
-- dives  (packages)
-- ============================================================================
create table if not exists public.dives (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  site            text not null,            -- display site name
  site_key        text not null,            -- tab grouping: tribe|red|light|turtle|multi
  depth_m         int,
  dive_min        int,
  train_min       int,
  duration_label  text,                     -- override for non-standard durations (full day, etc.)
  photos          int default 0,
  gopro_min       int default 0,
  price           int,                      -- INR per person; null => on request
  on_request      boolean not null default false,
  tier            text,                     -- Light | Premium | Premium+ | Signature | Certified | null
  pitch           text,                     -- one-line hero pitch (detail page)
  see_text        text,                     -- "what you'll see"
  for_text        text,                     -- "who it's for" (first-timer reassurance)
  steps           jsonb default '[]'::jsonb,-- [{title, body}] how-it-works
  image_url       text,
  active          boolean not null default true,
  sort            int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists dives_site_key_idx on public.dives (site_key);
create index if not exists dives_active_sort_idx on public.dives (active, sort);
drop trigger if exists dives_set_updated_at on public.dives;
create trigger dives_set_updated_at before update on public.dives
  for each row execute function public.set_updated_at();

-- ============================================================================
-- courses
-- ============================================================================
create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  duration     text,
  depth        text,
  min_age      text,
  price        int,                         -- null => on request
  on_request   boolean not null default false,
  description  text,
  sort         int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

-- ============================================================================
-- reviews
-- ============================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  country     text,
  rating      int not null default 5 check (rating between 1 and 5),
  text        text not null,
  featured    boolean not null default false,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- bookings / enquiries
-- ============================================================================
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  dive_id     uuid references public.dives(id) on delete set null,
  name        text,
  contact     text,
  people      int,
  date        date,
  status      text not null default 'new', -- new | contacted | confirmed | done
  notes       text,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- photos
-- ============================================================================
create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  alt         text,
  category    text,                         -- hero | dive | site | gallery
  target_id   uuid,                         -- optional FK-ish to dives/sites
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- settings (singleton)
-- ============================================================================
create table if not exists public.settings (
  id            int primary key default 1 check (id = 1),
  review_count  int not null default 0,
  rating_avg    numeric(2,1) not null default 4.8,
  dives_guided  text not null default '[X,000]',
  phone         text not null default '+91 76950 03828',
  whatsapp      text not null default '917695003828',
  email         text not null default 'info@scubaindia.in',
  instagram     text default '',
  facebook      text default '',
  address       text not null default 'Havelock Island, Andaman',
  google_url    text default '',
  updated_at    timestamptz not null default now()
);
drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security  (SPEC §7: public read; writes only authenticated admin)
-- ============================================================================
alter table public.dives    enable row level security;
alter table public.courses  enable row level security;
alter table public.reviews  enable row level security;
alter table public.bookings enable row level security;
alter table public.photos   enable row level security;
alter table public.settings enable row level security;

-- public read on content tables
create policy "public read dives"    on public.dives    for select using (true);
create policy "public read courses"  on public.courses  for select using (true);
create policy "public read reviews"  on public.reviews  for select using (true);
create policy "public read photos"   on public.photos   for select using (true);
create policy "public read settings" on public.settings for select using (true);

-- authenticated admin write on content tables
create policy "admin write dives"    on public.dives    for all to authenticated using (true) with check (true);
create policy "admin write courses"  on public.courses  for all to authenticated using (true) with check (true);
create policy "admin write reviews"  on public.reviews  for all to authenticated using (true) with check (true);
create policy "admin write photos"   on public.photos   for all to authenticated using (true) with check (true);
create policy "admin write settings" on public.settings for all to authenticated using (true) with check (true);

-- bookings: anyone may submit an enquiry; only admin may read / manage
create policy "anyone insert booking" on public.bookings for insert with check (true);
create policy "admin read bookings"   on public.bookings for select to authenticated using (true);
create policy "admin update bookings" on public.bookings for update to authenticated using (true) with check (true);
create policy "admin delete bookings" on public.bookings for delete to authenticated using (true);

-- ============================================================================
-- Storage bucket for admin image uploads (public read)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select using (bucket_id = 'media');
create policy "admin upload media"
  on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "admin update media"
  on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "admin delete media"
  on storage.objects for delete to authenticated using (bucket_id = 'media');
