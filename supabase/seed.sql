-- ============================================================================
-- Scuba India — seed data (SPEC §8 dives, §9 courses, §10 placeholders)
-- REAL prices — do not alter.  Idempotent-ish: truncates content tables first.
-- ============================================================================

truncate table public.dives    restart identity cascade;
truncate table public.courses  restart identity cascade;
truncate table public.reviews  restart identity cascade;

-- common how-it-works steps (SPEC §5.2)
-- Stored per-dive so admin can edit; we use the same first-timer flow as default.

-- ---------- Tribe Gate (12m, shallow reef, first-timers) -------------------
insert into public.dives
  (slug, name, site, site_key, depth_m, dive_min, train_min, photos, gopro_min, price, tier, pitch, see_text, for_text, steps, sort) values
('tribe-gate-light', '20-Min Taster Dive', 'Tribe Gate', 'tribe', 12, 20, 40, 20, 2, 3500, 'Light',
 'Your first breath underwater on Havelock''s calmest shallow reef.',
 'Gentle coral gardens in bright, shallow water — clownfish darting through anemones, butterflyfish, parrotfish nibbling the reef, and shoals of bright blue chromis. Visibility here is some of the best in the islands.',
 'Made for first-timers. You needn''t have dived before — or even be a strong swimmer. Tribe Gate''s shallow, sheltered water and an instructor at your side the whole time make this the easiest, safest way to try scuba.',
 '[{"title":"Arrive & meet","body":"We pick you up within 5km. Meet your PADI instructor, no rush."},{"title":"Safety brief","body":"Simple, jargon-free briefing on breathing and a few hand signals."},{"title":"Gear up","body":"We fit your mask, fins and gear and check everything twice."},{"title":"Your dive","body":"Into the shallows with your instructor at arm''s reach the entire time."},{"title":"Photos & video","body":"Your instructor shoots HD photos and GoPro video — yours to keep, free."}]', 10),

('tribe-gate-light-plus', '30-Min Explorer Dive', 'Tribe Gate', 'tribe', 12, 30, 40, 30, 3, 4000, 'Light',
 'A little longer underwater, a few more frames to take home.',
 'The same bright shallow reef as the Taster Dive, with extra time to settle in — more clownfish, anemones and reef life once your breathing relaxes.',
 'Ideal first-timers who want more than a taster. Still fully guided, still shallow — just a longer, calmer dive once nerves settle.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then meet your PADI instructor."},{"title":"Safety brief","body":"Easy briefing on breathing and hand signals."},{"title":"Gear up","body":"Fitted and double-checked before you touch the water."},{"title":"Your dive","body":"A longer 30-minute dive, instructor by your side throughout."},{"title":"Photos & video","body":"30 HD photos and 3 min of GoPro footage, included."}]', 20),

('tribe-gate-premium', '40-Min Adventure Dive', 'Tribe Gate', 'tribe', 12, 40, 50, 40, 4, 4500, 'Premium',
 'The full Tribe Gate experience — longer training, longer dive, more footage.',
 'Extended time over the shallow coral gardens to really explore — anemone cities, parrotfish, butterflyfish and the occasional curious wrasse following you along the reef.',
 'For first-timers who want the complete experience, and anyone who wants the most relaxed, unhurried dive. Extra training time means you''ll feel genuinely confident underwater.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km and a warm welcome from your instructor."},{"title":"Safety brief","body":"A fuller 50-minute training session so you feel ready."},{"title":"Gear up","body":"Personally fitted gear, checked before every dive."},{"title":"Your dive","body":"A relaxed 40-minute guided dive across the reef."},{"title":"Photos & video","body":"40 HD photos and 4 min of GoPro — free with this pack."}]', 30),

('tribe-gate-premium-plus', '50-Min Signature Dive', 'Tribe Gate', 'tribe', 12, 50, 50, 50, 5, 6000, 'Premium+',
 'Our longest Tribe Gate dive — the most time underwater and the biggest photo set.',
 'A full 50 minutes drifting the shallow reef: clownfish, anemones, parrotfish and reef shoals, with time to simply float and watch the coral come alive.',
 'For first-timers who want it all, and couples or friends who want the most memorable, unhurried first dive with the largest set of photos and video to take home.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your instructor."},{"title":"Safety brief","body":"Full training so you''re completely at ease."},{"title":"Gear up","body":"Fitted and double-checked gear."},{"title":"Your dive","body":"A full 50-minute guided dive — our longest Tribe Gate experience."},{"title":"Photos & video","body":"50 HD photos and 5 min of GoPro footage included."}]', 40),

-- ---------- Red Pillar (14m, coral & snorkelling, best value) --------------
('red-pillar-light', '20-Min Taster Dive', 'Red Pillar', 'red', 14, 20, 40, 20, 2, 2500, 'Light',
 'Havelock''s best-value first dive — coral pillars in clear water.',
 'Standing coral pillars wrapped in reef fish — sergeant majors, fusiliers, angelfish and the flash of a passing trigger. One of the most colourful shallow sites we dive.',
 'The easiest on the wallet and a brilliant first dive. Shallow, sheltered and fully guided — perfect if you''re curious but want to keep it simple.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then meet your PADI instructor."},{"title":"Safety brief","body":"Simple briefing on breathing and signals."},{"title":"Gear up","body":"Fitted and checked before you enter the water."},{"title":"Your dive","body":"A guided dive around the coral pillars, instructor beside you."},{"title":"Photos & video","body":"20 HD photos and 2 min of GoPro, free."}]', 50),

('red-pillar-light-plus', '30-Min Explorer Dive', 'Red Pillar', 'red', 14, 30, 40, 30, 3, 3000, 'Light',
 'More time on Havelock''s best-value reef, more photos to keep.',
 'Extended time among the coral pillars and their clouds of reef fish, with the chance to spot moray eels tucked into crevices and reef shrimp on the coral.',
 'Great value for first-timers who want a slightly longer, fuller dive. Still shallow and fully guided from start to finish.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km and a relaxed welcome."},{"title":"Safety brief","body":"Easy, jargon-free briefing."},{"title":"Gear up","body":"Fitted gear, double-checked."},{"title":"Your dive","body":"A longer 30-minute guided dive around the pillars."},{"title":"Photos & video","body":"30 HD photos and 3 min of GoPro included."}]', 60),

('red-pillar-premium', '40-Min Adventure Dive', 'Red Pillar', 'red', 14, 40, 50, 40, 4, 4000, 'Premium',
 'The full Red Pillar dive — extra training, a longer dive, more footage.',
 'A proper exploration of the pillars and surrounding reef — schooling fusiliers, angelfish, anemonefish and, if you''re lucky, a turtle gliding past.',
 'For first-timers who want the complete experience at the best-value site, with more training time so you feel truly confident underwater.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your instructor."},{"title":"Safety brief","body":"A fuller 50-minute training session."},{"title":"Gear up","body":"Personally fitted and checked gear."},{"title":"Your dive","body":"A relaxed 40-minute guided dive across the reef."},{"title":"Photos & video","body":"40 HD photos and 4 min of GoPro, free."}]', 70),

('red-pillar-premium-plus', '45-Min Signature Dive', 'Red Pillar', 'red', 14, 45, 50, 40, 4, 5000, 'Premium+',
 'Our longest Red Pillar dive for the most time among the coral.',
 'Nearly an hour over the pillars and reef — the longer you stay, the more comes out: moray eels, reef shrimp, schooling fish and the occasional turtle.',
 'For first-timers who want maximum time underwater at our best-value site. Fully guided throughout, with a big set of photos and video to take home.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km and a warm welcome."},{"title":"Safety brief","body":"Full training so you''re completely at ease."},{"title":"Gear up","body":"Fitted and double-checked gear."},{"title":"Your dive","body":"A 45-minute guided dive — our longest at Red Pillar."},{"title":"Photos & video","body":"40 HD photos and 4 min of GoPro included."}]', 80),

('red-pillar-snorkelling', 'Boat Snorkelling', 'Red Pillar', 'red', 14, null, null, 0, 0, 2000, null,
 'A full day on the water — no diving experience needed.',
 'Float over the coral pillars and reef from the surface and watch the fish below — clouds of fusiliers, anemonefish, and coral gardens in clear, calm water.',
 'For absolutely everyone — non-swimmers welcome with a vest, families, kids and anyone not ready to dive yet. All snorkelling gear is included.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Quick brief","body":"How to use your mask, snorkel and fins."},{"title":"Gear up","body":"All snorkelling gear and a flotation vest if you''d like one."},{"title":"On the water","body":"A full day floating over the reef at your own pace."},{"title":"Relax","body":"Soak up the islands between snorkel stops."}]', 90),

-- ---------- Lighthouse (18m, deeper reef) ----------------------------------
('lighthouse-scuba', 'Scuba Diving — Lighthouse', 'Lighthouse', 'light', 18, 30, 30, 30, 3, 4500, 'Signature',
 'Havelock''s deepest guided reef — bigger water, bigger fish.',
 'A deeper reef with more open water — schools of snapper and fusiliers, larger groupers, sweetlips along the rocks, and the chance of a reef shark cruising in the blue.',
 'For confident first-timers and anyone who wants a little more depth and adventure. Still fully guided — your instructor leads the whole dive — just a touch deeper and more dramatic.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your PADI instructor."},{"title":"Safety brief","body":"A clear briefing tailored to a slightly deeper dive."},{"title":"Gear up","body":"Fitted gear, checked twice before you descend."},{"title":"Your dive","body":"A guided 30-minute dive on Havelock''s deepest reef."},{"title":"Photos & video","body":"30 HD photos and 3 min of GoPro, free."}]', 100),

-- ---------- Turtle Beach (16m, turtles & coral, group dives) ---------------
('turtle-beach-group', 'Scuba Diving — Group of 4+', 'Turtle Beach', 'turtle', 16, 45, 30, 40, 4, 6500, null,
 'Dive with green sea turtles — the best price for groups of four or more.',
 'Green sea turtles grazing on seagrass and resting on the coral, surrounded by reef fish, healthy hard coral and the occasional ray over the sand.',
 'Best for groups of friends or family (4+) who want to share the experience and the best per-person price. Beginners welcome — every diver is guided.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km for the whole group."},{"title":"Safety brief","body":"Group briefing on breathing and signals."},{"title":"Gear up","body":"Everyone fitted and checked together."},{"title":"Your dive","body":"A 45-minute guided dive looking for turtles."},{"title":"Photos & video","body":"40 HD photos and 4 min of GoPro to share."}]', 110),

('turtle-beach-duo', 'Scuba Diving — 2 persons', 'Turtle Beach', 'turtle', 16, 45, 30, 40, 4, 7500, null,
 'A more personal turtle dive for two — closer guiding, same reef.',
 'The same turtle-rich reef — green sea turtles, hard coral and reef fish — with more one-to-one attention from your guide.',
 'Perfect for couples or a pair of friends who want a more personal, closely guided dive. Beginners welcome.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km for both of you."},{"title":"Safety brief","body":"A relaxed briefing for two."},{"title":"Gear up","body":"Both fitted and double-checked."},{"title":"Your dive","body":"A 45-minute guided dive with closer attention."},{"title":"Photos & video","body":"40 HD photos and 4 min of GoPro, free."}]', 120),

-- ---------- Multi-site & experiences ---------------------------------------
('fun-dives', 'Fun Dives — Red Pillar & Tribe Gate', 'Red Pillar & Tribe Gate', 'multi', 14, 45, null, 30, 3, 8000, 'Certified',
 'For certified divers — two of Havelock''s best sites in one trip.',
 'Two contrasting reefs in a single outing: the coral pillars and fish clouds of Red Pillar, then the shallow coral gardens of Tribe Gate, led by our divemasters.',
 'For already-certified divers who want to explore without a course. Bring your certification card — our divemasters lead, you enjoy the reef.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your divemaster."},{"title":"Dive brief","body":"Site briefing and a quick gear check of your certification."},{"title":"Gear up","body":"Full kit fitted and checked."},{"title":"Two dives","body":"Guided dives at Red Pillar and Tribe Gate, ~45 min."},{"title":"Photos & video","body":"30 HD photos and 3 min of GoPro across both sites."}]', 130),

('island-hopping', 'Island Hopping Trip', 'Havelock', 'multi', null, null, null, 0, 0, null, null,
 'A half-day on the water, finishing with sunset at Havelock Lighthouse.',
 'A relaxed cruise around Havelock''s coast and islands, with snorkel stops and a sunset finish at the Lighthouse — golden light over still water.',
 'For everyone — divers, non-divers, families and couples who simply want a beautiful half-day on the sea. No experience needed.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"A relaxed cruise around the coast and islands."},{"title":"Stops","body":"Snorkel and swim stops along the way."},{"title":"Sunset","body":"Finish with sunset at Havelock Lighthouse."},{"title":"Return","body":"Drop back within 5km."}]', 140);

-- Island Hopping is "on request" — flag it
update public.dives set on_request = true, duration_label = 'Half-day · 6 hours' where slug = 'island-hopping';
update public.dives set duration_label = 'Full day · all gear included' where slug = 'red-pillar-snorkelling';
update public.dives set duration_label = '45 min · two sites' where slug = 'fun-dives';

-- ============================================================================
-- PADI courses (SPEC §9) — REAL data
-- ============================================================================
insert into public.courses (name, duration, depth, min_age, price, on_request, description, sort) values
('PADI Scuba Diver',                 '2 days',     '12m', '12 / 15', 18000, false, 'Your first PADI certification — dive to 12m under the direct supervision of a PADI professional. A great stepping stone to Open Water.', 10),
('PADI Open Water Diver',            '3–4 days',   '18m', '12 / 15', 25000, false, 'The world''s most popular scuba course. Certifies you to dive independently with a buddy to 18m, for life, anywhere in the world.', 20),
('PADI Adventure Diver',             '1–2 days',   '30m', '12 / 15', null,  true,  'Try three adventure dives — like deep and underwater navigation — and build skills toward Advanced Open Water.', 30),
('PADI Advanced Open Water',         '2–3 days',   '30m', '12 / 15', 22000, false, 'Extend your range to 30m and complete five adventure dives including deep and navigation. Builds real confidence and skill.', 40),
('Emergency First Responder (EFR)',  '1–1.5 days', '—',   'None',    8000,  false, 'Primary and secondary care training — CPR and first aid. A prerequisite for Rescue Diver and useful for life.', 50),
('PADI Rescue Diver',                '3–4 days',   '—',   '12 / 15', 22000, false, 'Learn to prevent and manage dive emergencies and help other divers. Challenging, rewarding, and a favourite among divers.', 60);

-- ============================================================================
-- Reviews — intentionally empty. Add real Google reviews via /admin → Reviews
-- before launch; do not seed fake/placeholder reviewer names or quotes here.
-- ============================================================================

-- ============================================================================
-- Settings singleton (SPEC §10 placeholders; email MUST be info@scubaindia.in)
-- ============================================================================
insert into public.settings (id, review_count, rating_avg, dives_guided, phone, whatsapp, email, instagram, address)
values (1, 0, 4.8, '[X,000]', '+91 76950 03828', '917695003828', 'info@scubaindia.in', '', 'Havelock Island, Andaman')
on conflict (id) do update set
  review_count = excluded.review_count,
  email = excluded.email;
