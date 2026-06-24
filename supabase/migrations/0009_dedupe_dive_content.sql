-- ============================================================================
-- De-duplicate templated "for_text" / "steps" copy across the Tribe Gate and
-- Red Pillar dive variants. The seeded copy reused the same five step
-- sentences and "for first-timers who want..." phrasing across every
-- duration/price tier at both sites — thin, near-duplicate content across
-- otherwise distinct pages. Rewritten per row with the same underlying facts
-- (5km pickup, PADI instructor, train/dive minutes, photo & GoPro counts) but
-- distinct phrasing and structure. Snorkelling and other sites are untouched.
-- ============================================================================

update public.dives set
  for_text = 'Built for absolute beginners. You don''t need swimming experience or any diving background — Tribe Gate''s shallow, current-free water and an instructor who stays within arm''s reach make this the gentlest possible introduction to scuba.',
  steps = '[{"title":"Arrive & meet","body":"We collect you from anywhere within 5km of the jetty. No forms to fill out under pressure — you''ll meet your PADI instructor with time to spare before the boat leaves."},{"title":"Safety brief","body":"A few minutes is all it takes: two hand signals and the one rule that matters — never hold your breath underwater."},{"title":"Gear up","body":"Your instructor fits your mask, fins and BCD personally and runs through a buddy check before you go near the water."},{"title":"Your dive","body":"20 minutes over the shallow reef, your instructor at arm''s reach the entire time."},{"title":"Photos & video","body":"2 HD photos and 2 minutes of GoPro footage, shot during the dive and handed over free."}]'
where slug = 'tribe-gate-light';

update public.dives set
  for_text = 'The same easy reef as our Taster dive, just with ten more minutes in the water — useful once your breathing settles and you actually want to look around rather than just get through it.',
  steps = '[{"title":"Arrive & meet","body":"Pickup within 5km of the jetty, then straight to meeting your instructor — no waiting around."},{"title":"Safety brief","body":"The same short, plain-English run-through as our Taster dive: nothing extra to learn, nothing to worry about."},{"title":"Gear up","body":"Mask, fins and BCD fitted and checked twice, exactly as for every dive we run."},{"title":"Your dive","body":"30 minutes on the reef — long enough that most first-timers stop thinking about their gear and start noticing the fish."},{"title":"Photos & video","body":"3 HD photos and 3 minutes of GoPro footage, included with no extra charge."}]'
where slug = 'tribe-gate-light-plus';

update public.dives set
  for_text = 'Worth the extra training time if your goal is to actually feel confident underwater, not just tick off a first dive. The longer briefing means less hesitation once you''re below the surface.',
  steps = '[{"title":"Arrive & meet","body":"Collected within 5km of the jetty, with time set aside to ask your instructor questions before you suit up."},{"title":"Safety brief","body":"A fuller 50-minute session — more than our shorter packages — so the basics genuinely sink in."},{"title":"Gear up","body":"Personally fitted gear, checked twice, the same careful process as every Tribe Gate dive."},{"title":"Your dive","body":"40 minutes exploring the reef at your own pace, not the clock''s."},{"title":"Photos & video","body":"4 HD photos and 4 minutes of GoPro footage, included free."}]'
where slug = 'tribe-gate-premium';

update public.dives set
  for_text = 'Our longest, most unhurried package at this site — built for couples or friends who want their first dive to feel like an occasion rather than a quick try.',
  steps = '[{"title":"Arrive & meet","body":"Pickup within 5km, then a proper introduction to your instructor before anything is rushed."},{"title":"Safety brief","body":"A full training session covering everything from breathing to hand signals, at a pace that suits nervous first-timers."},{"title":"Gear up","body":"Fitted and double-checked gear — the same careful process, just with more time to ask questions."},{"title":"Your dive","body":"A full 50 minutes underwater, our longest dive at Tribe Gate, with room to simply float and watch the reef."},{"title":"Photos & video","body":"5 HD photos and 5 minutes of GoPro footage — our largest take-home set at this site."}]'
where slug = 'tribe-gate-premium-plus';

update public.dives set
  for_text = 'Havelock''s most affordable way to try scuba, without cutting corners on safety. Same shallow, sheltered conditions as our other taster dives — just at Red Pillar''s coral instead of Tribe Gate''s.',
  steps = '[{"title":"Arrive & meet","body":"We pick you up within 5km of the jetty and introduce you to your PADI instructor straight away."},{"title":"Safety brief","body":"A short, jargon-free briefing — really just the breathing rule and a couple of hand signals."},{"title":"Gear up","body":"Mask and fins fitted, BCD checked, before you''re anywhere near the water."},{"title":"Your dive","body":"20 minutes weaving around the coral pillars, instructor beside you throughout."},{"title":"Photos & video","body":"2 HD photos and 2 minutes of GoPro footage, included at no extra cost."}]'
where slug = 'red-pillar-light';

update public.dives set
  for_text = 'A slightly fuller first dive at the same accessible price point — a few extra minutes over the pillars without paying for our longer training packages.',
  steps = '[{"title":"Arrive & meet","body":"Pickup within 5km of the jetty, then an easy-going welcome from your instructor."},{"title":"Safety brief","body":"The same simple briefing as our Taster dive here — nothing extra to learn."},{"title":"Gear up","body":"Gear fitted and double-checked before you enter the water."},{"title":"Your dive","body":"30 minutes around the pillars — long enough to spot moray eels and reef shrimp tucked into the coral, if you know where to look."},{"title":"Photos & video","body":"3 HD photos and 3 minutes of GoPro footage included."}]'
where slug = 'red-pillar-light-plus';

update public.dives set
  for_text = 'For anyone who likes Red Pillar''s price but still wants the longer briefing and dive time of our Adventure packages — more training, more time on the reef, same best-value site.',
  steps = '[{"title":"Arrive & meet","body":"Collected within 5km of the jetty, with time to talk through the dive with your instructor before gearing up."},{"title":"Safety brief","body":"A fuller 50-minute briefing — the same training depth as our Adventure dives elsewhere, just at this site."},{"title":"Gear up","body":"Personally fitted and checked gear, no shortcuts taken."},{"title":"Your dive","body":"40 minutes properly exploring the pillars and surrounding reef, not just passing through."},{"title":"Photos & video","body":"4 HD photos and 4 minutes of GoPro footage, included free."}]'
where slug = 'red-pillar-premium';

update public.dives set
  for_text = 'Our longest dive at Red Pillar — for anyone who wants maximum time over this reef without paying Tribe Gate''s higher rates. Fully guided start to finish, with the largest photo set we offer at this site.',
  steps = '[{"title":"Arrive & meet","body":"Pickup within 5km, then a proper welcome and a chance to ask questions before you go in."},{"title":"Safety brief","body":"A full training session, the same depth of briefing as our top-tier packages elsewhere."},{"title":"Gear up","body":"Fitted and double-checked gear, every time, no exceptions."},{"title":"Your dive","body":"45 minutes over the pillars and reef — our longest dive at this site."},{"title":"Photos & video","body":"40 HD photos and 4 minutes of GoPro footage — our biggest take-home set here."}]'
where slug = 'red-pillar-premium-plus';
