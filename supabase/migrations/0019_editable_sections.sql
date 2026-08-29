-- Make the rest of the website editable from /admin.
--
-- Until now the reefs, the homepage "most booked" picks and several copy
-- blocks (why-us, team, final CTA) lived in code, so changing them needed a
-- developer. This adds:
--   dives.featured   -> tick a dive to feature it on the homepage
--   public.reefs     -> the four reefs, fully editable
--   public.sections  -> generic copy blocks for the remaining page sections
-- Seeded with exactly the current live wording, so the site looks identical
-- until someone edits something. Idempotent: safe to re-run.

-- ---------- 1. Featured dives (homepage "most booked") ---------------------
alter table public.dives add column if not exists featured boolean not null default false;

update public.dives set featured = true
where slug in ('discover-30', 'try-shore', 'fun-single', 'boat-snorkelling');

-- ---------- 2. Reefs -------------------------------------------------------
create table if not exists public.reefs (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,          -- tribe | red | light | turtle
  name       text not null,
  depth_m    int  not null default 12,
  level      text not null default 'All levels',
  best_for   text,
  blurb      text,
  image_url  text,                          -- blank => /images/reef-<key>
  life       jsonb not null default '[]'::jsonb,   -- ["Clownfish", ...]
  kinds      jsonb not null default '[]'::jsonb,   -- dive kinds offered here
  active     boolean not null default true,
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);
drop trigger if exists reefs_set_updated_at on public.reefs;
create trigger reefs_set_updated_at before update on public.reefs
  for each row execute function public.set_updated_at();

insert into public.reefs (key, name, depth_m, level, best_for, blurb, life, kinds, sort) values
('tribe','Tribe Gate',12,'Beginner-friendly','Discover Scuba & first dives',
 'A shallow, sunlit coral garden in calm, sheltered water — the easiest place to take your very first breath underwater.',
 '["Clownfish","Parrotfish","Green turtles","Coral gardens"]'::jsonb,
 '["try_shore","discover"]'::jsonb, 10),
('red','Red Pillar',14,'All levels','Discover Scuba, fun dives & snorkelling',
 'Standing coral pillars wrapped in clouds of reef fish — our most colourful and best-value site, brilliant on every dive.',
 '["Fusiliers","Angelfish","Coral pillars","Moray eels"]'::jsonb,
 '["try_shore","discover","snorkel"]'::jsonb, 20),
('light','Lighthouse',18,'Confident divers','Fun dives & night dives (certified)',
 'Deeper, more open water with bigger fish — schooling snapper, groupers and the occasional reef shark cruising the blue.',
 '["Snapper schools","Groupers","Reef sharks","Sweetlips"]'::jsonb,
 '["fun","night"]'::jsonb, 30),
('turtle','Turtle Beach',16,'All levels','Fun dives & turtle encounters',
 'Green sea turtles grazing the seagrass and rays gliding over the sand — an unhurried, wonderfully life-rich reef.',
 '["Green turtles","Stingrays","Seagrass beds","Hard coral"]'::jsonb,
 '["discover","fun"]'::jsonb, 40)
on conflict (key) do nothing;

-- ---------- 3. Editable page sections --------------------------------------
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,          -- hero | why | team | final_cta ...
  label      text not null,                 -- friendly name shown in admin
  eyebrow    text,
  title      text,
  subtitle   text,
  body       text,
  image_url  text,
  items      jsonb not null default '[]'::jsonb, -- [{title, body}] repeatable bits
  active     boolean not null default true,
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);
drop trigger if exists sections_set_updated_at on public.sections;
create trigger sections_set_updated_at before update on public.sections
  for each row execute function public.set_updated_at();

insert into public.sections (key, label, eyebrow, title, subtitle, items, sort) values
('why','Homepage — Why Scuba India','Why Scuba India','The dive shop locals send you to',null,
 '[{"title":"PADI-certified, always","body":"Professional instructors, equipment inspected before every dive, a strict buddy system. Safety is the standard, not the upsell."},{"title":"We know every reef","body":"Tribe Gate, Red Pillar, Lighthouse, Turtle Beach — we dive them daily and know where the coral is alive and the turtles feed."},{"title":"Your dive, on camera","body":"Every package includes HD photos and GoPro video at no extra cost. You leave with proof, not just a story."}]'::jsonb, 20),
('team','Homepage — Meet the crew','Our team','Meet the Scuba India crew',
 'Every dive is run by our own PADI & SSI-certified instructors and local Havelock boat crew — the people who know these reefs best. Small groups, careful guiding and a genuine welcome, on our own boat.',
 '[]'::jsonb, 30),
('final_cta','Homepage — Closing call to action',null,'Your Andaman dive is waiting',
 'Book in two minutes. Free photos. Certified guides. Still, clear water.','[]'::jsonb, 40),
('gallery','Homepage — Gallery','Gallery','Beneath the surface','Moments from our dives around Havelock.','[]'::jsonb, 50)
on conflict (key) do nothing;

-- ---------- 4. Row level security (match the existing tables) --------------
alter table public.reefs    enable row level security;
alter table public.sections enable row level security;

drop policy if exists "public read reefs"     on public.reefs;
drop policy if exists "admin write reefs"     on public.reefs;
drop policy if exists "public read sections"  on public.sections;
drop policy if exists "admin write sections"  on public.sections;

create policy "public read reefs"    on public.reefs    for select using (true);
create policy "admin write reefs"    on public.reefs    for all to authenticated using (true) with check (true);
create policy "public read sections" on public.sections for select using (true);
create policy "admin write sections" on public.sections for all to authenticated using (true) with check (true);
