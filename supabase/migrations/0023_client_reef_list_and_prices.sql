-- 0023 — the client's reef list, priced per reef.
--
-- Reefs are now priced individually (a further or richer reef costs more), so
-- the per-reef price is the real price, not an exception. Every reef is capped
-- at 12 m max depth.
--
-- Client's list and prices:
--   Red Pillar 3000 · Tribe Gate 3500 · Lighthouse 4500 · Slope 4500
--   Juvi's 5000 · Turtle Beach 7500 · Purple Ledge 4000
--
-- Idempotent: safe to re-run.

-- ---------- 1. Prices for the reefs we already have ------------------------
update public.reefs set price = 3000 where key = 'red';
update public.reefs set price = 3500 where key = 'tribe';
update public.reefs set price = 4500 where key = 'light';
update public.reefs set price = 7500 where key = 'turtle';

-- ---------- 2. The three reefs on the client's list we didn't have ---------
-- Photos are placeholders until real shots are uploaded in /admin -> Reefs,
-- and the descriptions are a starting point to edit there.
insert into public.reefs
  (key, name, depth_m, level, best_for, blurb, image_url, life, kinds, price, featured, sort)
values
('slope','Slope',12,'All levels','Boat dives for every level',
 'A gentle sloping reef that rewards a slow look — cleaning stations working away, and plenty going on in the small stuff for anyone who likes to hover and watch.',
 '/images/type-dsdboat',
 '["Mantis shrimp","Batfish","Cleaning stations"]'::jsonb,
 '["discover","fun"]'::jsonb, 4500, true, 40),
('juvis','Juvi''s',12,'All levels','Boat dives & bigger encounters',
 'Big coral heads with white-tip reef sharks resting up under the ledges — the reef to pick if you are hoping to come face to face with something larger.',
 '/images/type-fun',
 '["White-tip reef sharks","Potato coral","Reef fish"]'::jsonb,
 '["discover","fun"]'::jsonb, 5000, true, 50),
('purple','Purple Ledge',12,'All levels','Boat dives & photography',
 'A ledge carpeted in soft corals that glow purple in the afternoon light — the most photogenic reef we dive, and calm enough for a first dive.',
 '/images/type-island',
 '["Soft corals","Sea fans","Reef fish","Nudibranchs"]'::jsonb,
 '["discover","fun"]'::jsonb, 4000, true, 60)
on conflict (key) do nothing;

-- Keep prices right even if a re-run skipped the insert above.
update public.reefs set price = 4500 where key = 'slope';
update public.reefs set price = 5000 where key = 'juvis';
update public.reefs set price = 4000 where key = 'purple';

-- ---------- 3. Reefs not on the client's list ------------------------------
-- Hidden, not deleted — tick "Shown" in /admin -> Reefs to bring one back.
update public.reefs set active = false, featured = false
where key in ('nemo', 'aquarium', 'wall');

-- ---------- 4. Every reef, 12 m max depth, all on the homepage -------------
-- With a flat 12 m cap and an instructor on every dive, no reef is harder than
-- another, so they all read "All levels" and all take beginners and certified.
update public.reefs set depth_m = 12 where active is not false;
update public.reefs set featured = true where active is not false;
update public.reefs set level = 'All levels' where active is not false;
update public.reefs set kinds = '["discover","fun"]'::jsonb where active is not false;

-- Order them cheapest first, so the row opens at the friendliest price.
update public.reefs set sort = 10 where key = 'red';
update public.reefs set sort = 20 where key = 'tribe';
update public.reefs set sort = 30 where key = 'purple';
update public.reefs set sort = 40 where key = 'light';
update public.reefs set sort = 50 where key = 'slope';
update public.reefs set sort = 60 where key = 'juvis';
update public.reefs set sort = 70 where key = 'turtle';
