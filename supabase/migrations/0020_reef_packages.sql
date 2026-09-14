-- 0020 — three more reefs, and a single bookable package price per reef.
--
-- The homepage reef block becomes a row of simple package cards (one photo,
-- one price, book on WhatsApp) instead of flat thumbnails, so adds:
--   reefs.price           headline package price (blank => cheapest dive here)
--   reefs.duration_label  what that price buys, e.g. "30 min underwater"
--   reefs.featured        show this reef on the homepage
-- Idempotent: safe to re-run.

alter table public.reefs add column if not exists price int;
alter table public.reefs add column if not exists duration_label text;
alter table public.reefs add column if not exists featured boolean not null default false;

-- ---------- Three more Havelock sites --------------------------------------
-- Depths / marine life from published dive-site references for Swaraj Dweep.
-- Photos are placeholders until real shots are uploaded in /admin -> Reefs.
insert into public.reefs
  (key, name, depth_m, level, best_for, blurb, image_url, life, kinds, price, duration_label, featured, sort)
values
('nemo','Nemo Reef',13,'Beginner-friendly','First dives, training & snorkelling',
 'A sheltered bay off Beach No. 2 with almost no current and swimming-pool calm — the gentlest place in Havelock to learn, and shallow enough to snorkel the same coral.',
 '/images/type-tryshore',
 '["Clownfish","Sea anemones","Butterflyfish","Bannerfish"]'::jsonb,
 '["try_shore","discover","snorkel"]'::jsonb,
 5500,'30 min underwater', false, 50),
('aquarium','Aquarium',15,'All levels','Discover Scuba, fun dives & snorkelling',
 'Coral bommies rising from clean sand between 2 and 15 metres, with so much fish in the water column that you swim through the schools rather than towards them.',
 '/images/type-dsdboat',
 '["Snapper schools","Damselfish","Butterflyfish","Coral bommies"]'::jsonb,
 '["discover","fun","snorkel"]'::jsonb,
 6500,'30 min underwater', true, 60),
('wall','The Wall',18,'Confident divers','Fun dives & night dives (certified)',
 'Havelock''s classic drop-off — a soft-coral wall falling away past 30m, worked by barracuda, jackfish and giant trevally. Certified divers take the 10–18m ridge.',
 '/images/type-fun',
 '["Barracuda","Giant trevally","Soft corals","Napoleon wrasse"]'::jsonb,
 '["fun","night"]'::jsonb,
 5500,'One guided dive', false, 70)
on conflict (key) do nothing;

-- ---------- Which reefs lead the homepage ----------------------------------
-- Four cards: beginner -> all levels -> showcase -> certified, so the row
-- speaks to every visitor. Change these ticks any time in /admin -> Reefs.
update public.reefs set featured = true  where key in ('tribe','red','aquarium','light');
update public.reefs set featured = false where key in ('turtle','nemo','wall');
