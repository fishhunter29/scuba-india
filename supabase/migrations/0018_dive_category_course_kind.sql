-- Give every dive an explicit `category` and every course a `kind`, so the
-- homepage grouping, the /prices sections and the "ways to dive" cards all read
-- one field the admin sets from a friendly dropdown — no code editing needed.
-- Idempotent: safe to re-run.

alter table public.dives   add column if not exists category text;
alter table public.courses add column if not exists kind text not null default 'course';

-- ---------- Backfill dive categories from the current catalogue -------------
update public.dives set category = 'discover' where slug in ('discover-30','discover-45','discover-double','discover-combo') and category is null;
update public.dives set category = 'fun'      where slug in ('fun-single','fun-2dives','fun-4dives') and category is null;
update public.dives set category = 'night'    where slug = 'fun-night' and category is null;
update public.dives set category = 'snorkel'  where slug = 'boat-snorkelling' and category is null;
update public.dives set category = 'island'   where slug = 'island-hopping' and category is null;
update public.dives set category = 'charter'  where slug like 'charter-%' and category is null;

-- Rename the snorkelling product to match the site's "open sea" wording.
update public.dives set name = 'Open-Sea Snorkelling' where slug = 'boat-snorkelling';

-- ---------- Add the shore-entry Try Dive (indicative ₹3,500) ---------------
insert into public.dives
  (slug, name, site, site_key, depth_m, dive_min, train_min, photos, gopro_min, price, tier, category, pitch, see_text, for_text, steps, sort)
select 'try-shore', 'Try Dive — Shore', 'Havelock', 'multi', 12, 45, 40, 30, 3, 3500, null, 'try_shore',
 'Your first breath underwater, walking in from the beach.',
 'Shallow, sunlit coral close to shore — clownfish in their anemones, parrotfish and butterflyfish in calm, easy water.',
 'The gentlest, most budget-friendly way to try scuba. No experience or swimming skill needed — a PADI instructor holds you the whole time.',
 '[{"title":"Arrive & meet","body":"Pickup within 5km. Meet your PADI instructor, no rush."},{"title":"Safety brief","body":"Simple, jargon-free briefing on breathing and a few hand signals."},{"title":"Gear up","body":"We fit your mask, fins and gear and check everything twice."},{"title":"Your dive","body":"Wade in from the beach for a guided shallow dive, instructor beside you."},{"title":"Photos & video","body":"HD photos and GoPro video — yours to keep, free."}]'::jsonb, 5
where not exists (select 1 from public.dives where slug = 'try-shore');

update public.dives set category = 'try_shore' where slug = 'try-shore';

-- ---------- Backfill course kinds (combos vs single courses) ----------------
update public.courses set kind = 'combo' where name in (
  'PADI Open Water & Advanced Open Water Combo',
  'EFR + PADI Rescue Combo',
  'EFR + PADI Rescue + PADI Dive Master Combo',
  'Zero to Hero'
);
update public.courses set kind = 'course' where kind is null;

-- Island hopping has a real "from" price (per couple), not "on request".
update public.dives
  set on_request = false, price = 25000, duration_label = 'Per couple · from'
  where slug = 'island-hopping';
