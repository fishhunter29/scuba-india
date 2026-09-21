-- 0025 — put the reef table into the intended state, whatever it is now.
--
-- Earlier migrations assumed rows existed and only ever UPDATEd them, so any
-- reef that was missing or inactive stayed that way. This upserts all eight
-- reefs outright: every row is created if absent and corrected if present.
-- Run it on its own; it does not depend on 0023 or 0024 having worked.
--
-- Idempotent: safe to re-run as many times as you like.

insert into public.reefs
  (key, name, depth_m, level, best_for, blurb, image_url, life, kinds, price, duration_label, featured, active, sort)
values
('red','Red Pillar',12,'All levels','First dives & photography',
 'Standing coral pillars wrapped in clouds of reef fish — our most colourful and best-value site, brilliant on every dive.',
 '/images/gallery/g28','["Ruby snapper","Fusiliers","Coral pillars"]'::jsonb,
 '["discover","fun"]'::jsonb, 3000, null, true, true, 10),

('tribe','Tribe Gate',12,'All levels','First dives',
 'A shallow, sunlit coral garden in calm, sheltered water — the easiest place to take your very first breath underwater.',
 '/images/gallery/g29','["Clownfish","Green turtles","Anemones"]'::jsonb,
 '["discover","fun"]'::jsonb, 3500, null, true, true, 20),

('purple','Purple Ledge',12,'All levels','Boat dives & photography',
 'A ledge carpeted in soft corals that glow purple in the afternoon light — the most photogenic reef we dive, and calm enough for a first dive.',
 '/images/gallery/g17','["Soft corals","Lionfish","Sea fans"]'::jsonb,
 '["discover","fun"]'::jsonb, 4000, null, true, true, 30),

('light','Lighthouse',12,'All levels','Bigger fish',
 'More open water with bigger fish — trevally hunting through the blue, schooling snapper and moorish idols over the rocky reef.',
 '/images/gallery/g26','["Trevally","Moorish idols","Snapper schools"]'::jsonb,
 '["discover","fun"]'::jsonb, 4500, null, true, true, 40),

('slope','Slope',12,'All levels','Boat dives for every level',
 'A gentle sloping reef that rewards a slow look — cleaning stations working away, and plenty going on in the small stuff for anyone who likes to hover and watch.',
 '/images/gallery/g25','["Mantis shrimp","Batfish","Staghorn coral"]'::jsonb,
 '["discover","fun"]'::jsonb, 4500, null, true, true, 50),

('juvis','Juvi''s',12,'All levels','Bigger encounters',
 'Big coral heads with white-tip reef sharks resting up under the ledges — the reef to pick if you are hoping to come face to face with something larger.',
 '/images/gallery/g27','["White-tip reef sharks","Potato coral","Moorish idols"]'::jsonb,
 '["discover","fun"]'::jsonb, 5000, null, true, true, 60),

('aquarium','Aquarium',12,'All levels','Boat dives & snorkelling',
 'Coral bommies rising from clean sand, with so much fish in the water column that you swim through the schools rather than towards them — the reef that earns its name.',
 '/images/gallery/g08','["Snapper schools","Fusiliers","Coral bommies"]'::jsonb,
 '["discover","fun"]'::jsonb, 6500, null, true, true, 65),

('turtle','Turtle Beach',12,'All levels','Turtle encounters',
 'Green sea turtles grazing the seagrass and rays gliding over the sand — an unhurried, wonderfully life-rich reef.',
 '/images/gallery/g06','["Green turtles","Stingrays","Seagrass beds"]'::jsonb,
 '["discover","fun"]'::jsonb, 7500, null, true, true, 70)

on conflict (key) do update set
  name          = excluded.name,
  depth_m       = excluded.depth_m,
  level         = excluded.level,
  best_for      = excluded.best_for,
  blurb         = excluded.blurb,
  image_url     = excluded.image_url,
  life          = excluded.life,
  kinds         = excluded.kinds,
  price         = excluded.price,
  duration_label = excluded.duration_label,
  featured      = excluded.featured,
  active        = excluded.active,
  sort          = excluded.sort;

-- Reefs we no longer run.
update public.reefs set active = false, featured = false
where key in ('nemo', 'wall');
