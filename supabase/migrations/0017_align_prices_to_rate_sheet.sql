-- Align the live catalogue with the official rate sheet.
-- Discover Scuba is now priced by duration (not per reef); Fun Dives are a
-- clear certified-only set; courses gain Divemaster and drop Adventure Diver.
-- Reefs remain real dive locations (see the "Four reefs" section) but no
-- longer carry their own price tiers. Idempotent: safe to re-run.

-- ---------- Dives: replace old per-reef catalogue with rate-sheet products ---
delete from public.dives where slug in (
  'tribe-gate-light','tribe-gate-light-plus','tribe-gate-premium','tribe-gate-premium-plus',
  'red-pillar-light','red-pillar-light-plus','red-pillar-premium','red-pillar-premium-plus',
  'red-pillar-snorkelling','lighthouse-scuba','turtle-beach-group','turtle-beach-duo','fun-dives',
  'discover-30','discover-45','discover-double','discover-combo',
  'fun-single','fun-night','fun-2dives','fun-4dives','boat-snorkelling','island-hopping'
);

insert into public.dives
  (slug, name, site, site_key, depth_m, dive_min, train_min, photos, gopro_min, price, tier, pitch, see_text, for_text, steps, sort) values
('discover-30', '30-Min Discover Scuba Dive', 'Havelock', 'multi', 12, 30, 40, 30, 3, 3800, null,
 'Your first breath underwater — a guided 30-minute dive from the boat.',
 'Bright, shallow coral gardens — clownfish in their anemones, parrotfish and butterflyfish, and shoals of blue chromis over healthy hard coral in some of the islands'' clearest water.',
 'Made for first-timers. You needn''t have dived before, or even be a strong swimmer. Shallow, sheltered water and a PADI instructor at your side the whole time make this the easiest, safest way to try scuba.',
 '[{"title":"Arrive & meet","body":"We pick you up within 5km. Meet your PADI instructor, no rush."},{"title":"Safety brief","body":"Simple, jargon-free briefing on breathing and a few hand signals."},{"title":"Gear up","body":"We fit your mask, fins and gear and check everything twice."},{"title":"Your dive","body":"A guided 30-minute dive from the boat, instructor at arm''s reach the whole time."},{"title":"Photos & video","body":"HD photos and GoPro video — yours to keep, free."}]', 10),

('discover-45', '45-Min Discover Scuba Dive', 'Havelock', 'multi', 14, 45, 40, 40, 4, 4500, null,
 'More time underwater once your breathing settles — a relaxed 45-minute guided dive.',
 'The same bright reef with extra time to settle in — more clownfish, anemones, reef fish and coral once your breathing relaxes and you start to feel at home underwater.',
 'Ideal for first-timers who want more than a taster. Still fully guided, still shallow — just a longer, calmer dive with a bigger photo set to take home.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then meet your PADI instructor."},{"title":"Safety brief","body":"Easy briefing on breathing and hand signals."},{"title":"Gear up","body":"Fitted and double-checked before you touch the water."},{"title":"Your dive","body":"A longer 45-minute guided dive from the boat, instructor by your side."},{"title":"Photos & video","body":"HD photos and GoPro footage, included free."}]', 20),

('discover-double', '2 × 30-Min Discover Scuba Dives', 'Havelock', 'multi', 14, 60, 40, 40, 4, 7500, null,
 'Two guided dives in one trip — the best way to really get comfortable underwater.',
 'Two shallow reefs in a single outing — twice the coral, twice the fish, and the second dive is always the one where it all clicks and you truly relax.',
 'For first-timers who know they''ll want more than one dive, and couples or friends making a day of it. Both dives fully guided from start to finish.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km and a warm welcome from your instructor."},{"title":"Safety brief","body":"A clear briefing before your first dive."},{"title":"Gear up","body":"Personally fitted gear, checked before every dive."},{"title":"Two dives","body":"Two guided 30-minute dives from the boat with a surface break between."},{"title":"Photos & video","body":"HD photos and GoPro across both dives, free."}]', 30),

('discover-combo', '30 + 45 Min Discover Scuba Dives', 'Havelock', 'multi', 16, 75, 40, 50, 5, 9000, null,
 'Our biggest beginner package — two dives, the most time underwater and the largest photo set.',
 'A 30-minute dive to find your feet, then a longer 45-minute dive to explore — reef fish, anemones, coral gardens and time to simply float and watch the reef come alive.',
 'For first-timers who want the complete experience, and couples who want the most memorable day on the water with the biggest set of photos and video to keep.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your instructor."},{"title":"Safety brief","body":"Full training so you''re completely at ease."},{"title":"Gear up","body":"Fitted and double-checked gear."},{"title":"Two dives","body":"A 30-minute dive, then a longer 45-minute dive from the boat."},{"title":"Photos & video","body":"HD photos and GoPro footage from both dives, included."}]', 40),

('fun-single', 'Single Fun Dive', 'Havelock', 'multi', 18, 45, null, 30, 3, 4000, 'Certified',
 'One guided dive on Havelock''s best reefs for already-certified divers.',
 'Whichever site is diving best that day — coral pillars and fish clouds, deeper reefs with snapper and groupers, or turtle-rich seagrass, led by our divemasters.',
 'For certified divers who want to get in the water without a course. Bring your certification card — our divemasters lead, you enjoy the reef.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your divemaster."},{"title":"Dive brief","body":"Site briefing and a quick check of your certification."},{"title":"Gear up","body":"Full kit fitted and checked."},{"title":"Your dive","body":"A guided 45-minute dive on the day''s best site."},{"title":"Photos & video","body":"HD photos and GoPro, free."}]', 50),

('fun-night', 'Night Dive', 'Havelock', 'multi', 16, 45, null, 30, 3, 4500, 'Certified',
 'The reef after dark — a guided night dive for certified divers.',
 'A whole different reef by torchlight — hunting lionfish, sleeping parrotfish, crabs and shrimp out in the open, and bioluminescence sparkling in the dark water.',
 'For certified divers comfortable in the water who want something special. Torches, full guiding and a thorough night-dive briefing included.',
 '[{"title":"Arrive & meet","body":"Evening pickup within 5km, meet your divemaster."},{"title":"Night brief","body":"A full briefing on torch signals and the night dive."},{"title":"Gear up","body":"Full kit and dive torches, checked before you enter."},{"title":"Your dive","body":"A guided 45-minute night dive on a sheltered reef."},{"title":"Photos & video","body":"HD photos and GoPro of the reef after dark."}]', 60),

('fun-2dives', 'Fun Dives — 1 Day, 2 Dives', 'Havelock', 'multi', 18, 90, null, 40, 4, 7500, 'Certified',
 'Two guided fun dives in a day — two of Havelock''s best sites.',
 'Two contrasting reefs in one day: coral pillars and fish clouds at one, deeper water with bigger fish or grazing turtles at the next, led by our divemasters.',
 'For certified divers who want a proper day on the water. Bring your certification card — we handle the rest across two guided dives.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, meet your divemaster."},{"title":"Dive brief","body":"Briefing for both sites and a certification check."},{"title":"Gear up","body":"Full kit fitted and checked."},{"title":"Two dives","body":"Two guided dives on two different reefs, with a surface break."},{"title":"Photos & video","body":"HD photos and GoPro across both dives, free."}]', 70),

('fun-4dives', 'Fun Dives — 2 Days, 4 Dives', 'Havelock', 'multi', 18, 180, null, 60, 6, 14500, 'Certified',
 'Four guided dives over two days — the best value for certified divers.',
 'Four dives across Havelock''s range of reefs over two days — the widest variety of coral, fish life, depths and conditions, with the best per-dive price we offer.',
 'For certified divers making the most of their trip. Four guided dives, all gear included, across the best sites the conditions allow.',
 '[{"title":"Arrive & meet","body":"Daily pickup within 5km, meet your divemaster."},{"title":"Dive brief","body":"Site briefings each day and a certification check."},{"title":"Gear up","body":"Full kit fitted and checked each day."},{"title":"Four dives","body":"Four guided dives over two days across the best reefs."},{"title":"Photos & video","body":"HD photos and GoPro across all four dives, free."}]', 80),

('boat-snorkelling', 'Boat Snorkelling', 'Havelock', 'multi', null, null, null, 0, 0, 2000, null,
 'A full day on the water — no diving experience needed.',
 'Float over the coral and reef from the surface and watch the fish below — clouds of fusiliers, anemonefish and coral gardens in clear, calm water.',
 'For absolutely everyone — non-swimmers welcome with a vest, families, kids and anyone not ready to dive yet. All snorkelling gear is included.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Quick brief","body":"How to use your mask, snorkel and fins."},{"title":"Gear up","body":"All snorkelling gear and a flotation vest if you''d like one."},{"title":"On the water","body":"A full day floating over the reef at your own pace."},{"title":"Relax","body":"Soak up the islands between snorkel stops."}]', 90),

('island-hopping', 'Island Hopping Trip', 'Havelock', 'multi', null, null, null, 0, 0, null, null,
 'A day around Havelock — snorkelling, scuba and sunset at the lighthouse.',
 'A relaxed cruise around Havelock''s coast and islands, with snorkel and scuba stops and a sunset finish at the Lighthouse — golden light over still water.',
 'For everyone — divers, non-divers, families and couples who want a beautiful day on the sea. Starting price is per couple; message us to tailor it.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"A relaxed cruise around the coast and islands."},{"title":"Snorkel & dive","body":"Snorkelling and scuba stops along the way."},{"title":"Sunset","body":"Finish with sunset at Havelock Lighthouse."},{"title":"Return","body":"Drop back within 5km."}]', 100);

update public.dives set on_request = true, duration_label = 'Per couple · from ₹25,000' where slug = 'island-hopping';
update public.dives set duration_label = 'Full day · all gear included' where slug = 'boat-snorkelling';

-- ---------- Courses: rate-sheet alignment ----------------------------------
-- Drop Adventure Diver (not on the rate sheet).
delete from public.courses where name = 'PADI Adventure Diver';

-- EFR: correct name + price.
update public.courses
  set name = 'Emergency First Response (EFR)', price = 10000, on_request = false
  where name like 'Emergency First Res%';

-- Add Divemaster if it isn't already there.
insert into public.courses (name, duration, depth, min_age, price, on_request, description, sort)
select 'PADI Divemaster — Go Pro Internship', '4–6 weeks', '—', '18', 70000, false,
       'Your first professional rating. Work alongside our team, master dive leadership and take the first step to a career in diving.', 60
where not exists (select 1 from public.courses where name like 'PADI Divemaster%');
