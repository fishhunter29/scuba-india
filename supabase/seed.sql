-- ============================================================================
-- Scuba India — seed data (SPEC §8 dives, §9 courses, §10 placeholders)
-- REAL prices — do not alter.  Idempotent-ish: truncates content tables first.
-- ============================================================================

truncate table public.dives    restart identity cascade;
truncate table public.courses  restart identity cascade;
truncate table public.reviews  restart identity cascade;

-- Dive products follow the official rate sheet: Discover Scuba priced by
-- duration (not by reef), Fun Dives for certified divers, and experiences.
-- Which reef you dive is chosen on the day to suit conditions and level.

-- ---------- Discover Scuba (beginners, with PADI online DSD registration) ---
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

-- ---------- Fun Dives (certified divers only) ------------------------------
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

-- ---------- Experiences ----------------------------------------------------
('boat-snorkelling', 'Boat Snorkelling', 'Havelock', 'multi', null, null, null, 0, 0, 2000, null,
 'A full day on the water — no diving experience needed.',
 'Float over the coral and reef from the surface and watch the fish below — clouds of fusiliers, anemonefish and coral gardens in clear, calm water.',
 'For absolutely everyone — non-swimmers welcome with a vest, families, kids and anyone not ready to dive yet. All snorkelling gear is included.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Quick brief","body":"How to use your mask, snorkel and fins."},{"title":"Gear up","body":"All snorkelling gear and a flotation vest if you''d like one."},{"title":"On the water","body":"A full day floating over the reef at your own pace."},{"title":"Relax","body":"Soak up the islands between snorkel stops."}]', 90),

('island-hopping', 'Island Hopping Trip', 'Havelock', 'multi', null, null, null, 0, 0, null, null,
 'A day around Havelock — snorkelling, scuba and sunset at the lighthouse.',
 'A relaxed cruise around Havelock''s coast and islands, with snorkel and scuba stops and a sunset finish at the Lighthouse — golden light over still water.',
 'For everyone — divers, non-divers, families and couples who want a beautiful day on the sea. Starting price is per couple; message us to tailor it.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"A relaxed cruise around the coast and islands."},{"title":"Snorkel & dive","body":"Snorkelling and scuba stops along the way."},{"title":"Sunset","body":"Finish with sunset at Havelock Lighthouse."},{"title":"Return","body":"Drop back within 5km."}]', 100),

-- ---------- Boat charters (private hire) -----------------------------------
('charter-1h', 'Boat Charter — 1 Hour', 'Havelock', 'multi', null, null, null, 0, 0, 13500, null,
 'Your own private boat for an hour on the water around Havelock.',
 'The coast and islands of Havelock from your own boat — turquoise water, forested shores and whatever the day brings, all at your own pace.',
 'For groups, families and couples who want the boat to themselves — a private cruise, a photo trip, or a run to a quieter stretch of coast.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"Your private boat and crew for the hour."},{"title":"On the water","body":"Cruise the coast at your own pace."},{"title":"Return","body":"Back to shore and a drop within 5km."}]', 110),

('charter-1-5h', 'Boat Charter — 1.5 Hours', 'Havelock', 'multi', null, null, null, 0, 0, 17500, null,
 'A private boat for ninety minutes around Havelock''s coast and islands.',
 'More time on the water — coastline, islands and calm bays, with the boat entirely yours to slow down and enjoy.',
 'For groups and families who want a little longer on their own private boat, at their own pace.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"Your private boat and crew for 90 minutes."},{"title":"On the water","body":"Explore the coast and bays unhurried."},{"title":"Return","body":"Back to shore and a drop within 5km."}]', 120),

('charter-2h', 'Boat Charter — 2 Hours', 'Havelock', 'multi', null, null, null, 0, 0, 21000, null,
 'Two hours of private boat time to explore Havelock from the water.',
 'A proper stretch on the water — reach further along the coast, linger at the spots you like, and take it all in from your own boat.',
 'For groups and families who want unhurried time on a private boat to explore Havelock''s coast and islands.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"Your private boat and crew for two hours."},{"title":"On the water","body":"Explore further along the coast at your own pace."},{"title":"Return","body":"Back to shore and a drop within 5km."}]', 130),

('charter-half-day', 'Boat Charter — Half Day', 'Havelock', 'multi', null, null, null, 0, 0, 45000, null,
 'A half day with a private boat and crew — Havelock, your way.',
 'A whole half day on the water — multiple stops, snorkel spots, quiet beaches and coastline, entirely on your own schedule.',
 'For groups, families and celebrations who want the freedom of a private boat for the day''s highlights.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km, then to the boat."},{"title":"Set off","body":"Your private boat and crew for the half day."},{"title":"On the water","body":"Multiple stops and beaches, all on your schedule."},{"title":"Return","body":"Back to shore and a drop within 5km."}]', 140);

-- ---------- Shore-entry Try Dive (indicative ₹3,500) -----------------------
insert into public.dives
  (slug, name, site, site_key, depth_m, dive_min, train_min, photos, gopro_min, price, tier, pitch, see_text, for_text, steps, sort) values
('try-shore', 'Try Dive — Shore', 'Havelock', 'multi', 12, 45, 40, 30, 3, 3500, null,
 'Your first breath underwater, walking in from the beach.',
 'Shallow, sunlit coral close to shore — clownfish in their anemones, parrotfish and butterflyfish in calm, easy water.',
 'The gentlest, most budget-friendly way to try scuba. No experience or swimming skill needed — a PADI instructor holds you the whole time.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km. Meet your PADI instructor, no rush."},{"title":"Safety brief","body":"Simple, jargon-free briefing on breathing and a few hand signals."},{"title":"Gear up","body":"We fit your mask, fins and gear and check everything twice."},{"title":"Your dive","body":"Wade in from the beach for a guided shallow dive, instructor beside you."},{"title":"Photos & video","body":"HD photos and GoPro video — yours to keep, free."}]', 5);

-- Rename the snorkelling product to match the site's "open sea" wording.
update public.dives set name = 'Open-Sea Snorkelling' where slug = 'boat-snorkelling';

-- Island Hopping has a real "from" price per couple (not on-request).
update public.dives set on_request = false, price = 25000, duration_label = 'Per couple · from' where slug = 'island-hopping';
update public.dives set duration_label = 'Full day · all gear included' where slug = 'boat-snorkelling';
update public.dives set duration_label = '1 hour · private boat'    where slug = 'charter-1h';
update public.dives set duration_label = '1.5 hours · private boat' where slug = 'charter-1-5h';
update public.dives set duration_label = '2 hours · private boat'   where slug = 'charter-2h';
update public.dives set duration_label = 'Half day · private boat'  where slug = 'charter-half-day';

-- Explicit dive category (drives homepage grouping, /prices, ways-to-dive).
update public.dives set category = 'discover'  where slug in ('discover-30','discover-45','discover-double','discover-combo');
update public.dives set category = 'try_shore' where slug = 'try-shore';
update public.dives set category = 'fun'       where slug in ('fun-single','fun-2dives','fun-4dives');
update public.dives set category = 'night'     where slug = 'fun-night';
update public.dives set category = 'snorkel'   where slug = 'boat-snorkelling';
update public.dives set category = 'island'    where slug = 'island-hopping';
update public.dives set category = 'charter'   where slug like 'charter-%';

-- ============================================================================
-- PADI courses (SPEC §9) — REAL data
-- ============================================================================
insert into public.courses (name, duration, depth, min_age, price, on_request, description, sort) values
('PADI Scuba Diver',                 '2 days',     '12m', '12 / 15', 18000, false, 'Your first PADI certification — dive to 12m under the direct supervision of a PADI professional. A great stepping stone to Open Water.', 10),
('PADI Open Water Diver',            '3–4 days',   '18m', '12 / 15', 25000, false, 'The world''s most popular scuba course. Certifies you to dive independently with a buddy to 18m, for life, anywhere in the world.', 20),
('PADI Advanced Open Water',         '2–3 days',   '30m', '12 / 15', 22000, false, 'Extend your range to 30m and complete five adventure dives including deep and navigation. Builds real confidence and skill.', 30),
('Emergency First Response (EFR)',   '1–1.5 days', '—',   'None',    10000, false, 'Primary and secondary care training — CPR and first aid. A prerequisite for Rescue Diver and useful for life.', 40),
('PADI Rescue Diver',                '3–4 days',   '—',   '12 / 15', 22000, false, 'Learn to prevent and manage dive emergencies and help other divers. Challenging, rewarding, and a favourite among divers.', 50),
('PADI Divemaster — Go Pro Internship', '4–6 weeks', '—', '18',      70000, false, 'Your first professional rating. Work alongside our team, master dive leadership and take the first step to a career in diving.', 60),
-- Course combos (rate sheet)
('PADI Open Water & Advanced Open Water Combo', '5–7 days',   '30m', '12 / 15', 40000,  false, 'Go from beginner to Advanced in one trip — Open Water then Advanced Open Water, for less than booking the two separately.', 70),
('EFR + PADI Rescue Combo',                     '4–5 days',   '—',   '12 / 15', 28000,  false, 'Emergency First Response and Rescue Diver together — the safety-focused pair that makes you a calmer, more capable diver.', 80),
('EFR + PADI Rescue + PADI Dive Master Combo',  '4–6 weeks',  '—',   '18',      95000,  false, 'Everything you need to go pro — EFR, Rescue and Divemaster in one pathway, the smart route into a diving career.', 90),
('Zero to Hero',                                '6–10 weeks', '30m', '18',      130000, false, 'From your first breath underwater to a PADI professional — Open Water all the way to Divemaster in a single journey.', 100);

-- Mark which courses are bundles (combos) vs single certifications.
update public.courses set kind = 'combo' where name in (
  'PADI Open Water & Advanced Open Water Combo',
  'EFR + PADI Rescue Combo',
  'EFR + PADI Rescue + PADI Dive Master Combo',
  'Zero to Hero'
);

-- ============================================================================
-- Reviews — intentionally empty. Add real Google reviews via /admin → Reviews
-- before launch; do not seed fake/placeholder reviewer names or quotes here.
-- ============================================================================

-- ============================================================================
-- Settings singleton (SPEC §10 placeholders; email MUST be info@scubaindia.in)
-- ============================================================================
insert into public.settings (id, review_count, rating_avg, dives_guided, phone, whatsapp, email, instagram, address)
values (1, 0, 4.8, '[X,000]', '+91 94342 90310', '917695003828', 'info@scubaindia.in', '', 'Havelock Island, Andaman')
on conflict (id) do update set
  review_count = excluded.review_count,
  email = excluded.email;
