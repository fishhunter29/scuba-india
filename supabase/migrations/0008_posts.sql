-- ============================================================================
-- posts (dive guides / blog) — SEO content section, scalable beyond the
-- fixed dives/courses catalogue. Public read on published only; admin write.
-- ============================================================================
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  body            text not null,
  cover_image_url text,
  published       boolean not null default true,
  published_at    timestamptz not null default now(),
  sort            int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
create policy "public read published posts" on public.posts for select using (published = true);
create policy "admin write posts" on public.posts for all to authenticated using (true) with check (true);

-- Seed three cornerstone guides. Content is general diving/travel guidance
-- plus facts already published elsewhere on the site (site depths, course
-- durations) — no invented stats, reviews or business claims.
insert into public.posts (slug, title, excerpt, body, published, published_at, sort) values

('best-time-to-dive-havelock-andaman',
 'Best Time to Dive in Havelock, Andaman: A Season-by-Season Guide',
 'When to plan your trip, what the seasons actually look like underwater, and how to pick a site that suits the conditions.',
 '## When Havelock''s Dive Season Runs

Havelock Island, like the rest of the Andaman archipelago, has two very different halves of the year. The dive season generally runs from **November to April**, when the seas are calm, the monsoon has passed, and conditions on the reefs are at their best. Most dive centres on the island, including ours, operate through this window.

From June to September, the south-west monsoon brings rough seas and frequent rain, and most operators pause diving for safety. May and October sit in between — usually diveable, but with more variable conditions as the seasons turn.

## The Best Months for First-Timers

If you''re trying scuba for the first time, December through February is the easiest window: settled seas, comfortable conditions, and the calmest entry into the water. It''s also the busiest period for tourism in Havelock, so if you''re travelling then, it''s worth messaging ahead to lock in a slot.

## What About Water Temperature?

Andaman''s waters stay warm year-round by global standards, so a wetsuit is rarely essential for shallow reef dives, though some divers prefer a thin one for comfort on longer or deeper dives.

## Choosing a Site for the Season

Not every site behaves the same way:

- Tribe Gate (12m) — sheltered and shallow, often diveable even when other sites are choppier.
- Red Pillar (14m) — Havelock''s best-value reef, good for most of the season.
- Lighthouse (18m) — a deeper site best dived in calmer conditions.
- Turtle Beach (16m) — sea turtles, weather permitting.

If you''re planning a trip and unsure what conditions will be like, message us on WhatsApp before you book — we''ll tell you honestly what to expect that week, not just what''s convenient to say.',
 true, now(), 10),

('first-scuba-dive-what-to-expect',
 'Your First Scuba Dive in Havelock: What Actually Happens',
 'No experience, no certification, no idea what to expect? Here''s exactly what a try dive looks like, step by step.',
 '## You Don''t Need Experience — or Even to Be a Strong Swimmer

A try dive (sometimes called a Discover Scuba dive) is built for people who have never put their head underwater with a tank before. You don''t need a certification or prior diving experience. You do need to be reasonably fit and free of certain medical conditions — your instructor will run through a short health check before you go in.

## Step by Step: What Happens on the Day

**Arrive and meet your instructor.** Most try dives include pickup and drop-off within a short distance of your stay on Havelock. You''ll meet your PADI instructor before anything else happens — no rushing into gear.

**A simple, jargon-free safety briefing.** You''ll learn a couple of hand signals and the one rule that matters most: never hold your breath underwater. That''s the bulk of what you need to know before your first dive.

**Getting geared up.** Your instructor fits your mask, fins and BCD (the jacket that holds your tank) and checks everything before you''re anywhere near the water.

**The dive itself.** Your instructor stays within arm''s reach the entire time, at a depth and pace suited to first-timers. On Havelock''s shallower sites, that usually means calm, sheltered water and bright coral close to the surface.

**Photos and video.** Most operators, us included, shoot HD photos and GoPro footage during the dive — ask in advance what''s included so there are no surprises afterwards.

## What to Bring

Swimwear, a towel, and a willingness to breathe a little differently than you''re used to. Everything else — mask, fins, tank, wetsuit if needed — is provided.

## After Your Try Dive

If you enjoy it, a try dive doesn''t certify you to dive independently, but it''s a natural first step before a PADI Scuba Diver or Open Water course if you decide to go further.',
 true, now(), 20),

('padi-open-water-vs-scuba-diver',
 'PADI Scuba Diver vs Open Water: Which Course Should You Choose?',
 'Both are real PADI certifications. Here''s the actual difference between the two most common starting courses — and how to choose.',
 '## The Short Answer

If you''re not sure you''ll dive often, PADI Scuba Diver is the smaller commitment — typically around two days, certifying you to dive to 12m under the direct supervision of a PADI professional. If you want the full, independent certification recognised worldwide for life, PADI Open Water Diver — typically three to four days, certifying you to 18m — is the standard choice most divers eventually take.

## What PADI Scuba Diver Covers

Scuba Diver is built around the first sessions of the full Open Water course. You''ll learn core skills — clearing your mask, controlling buoyancy, basic emergency procedures — across a couple of days, ending with a real, lifelong PADI certification. The trade-off: you always dive with a PADI professional supervising, never fully independently.

## What PADI Open Water Adds

Open Water Diver completes the remaining sessions and open-water dives, taking you to full certification: you can dive independently with a buddy, anywhere in the world, to 18m, for life. It''s the world''s most widely held scuba certification, and the one most dive shops and liveaboards expect to see.

## Can You Upgrade Later?

Generally, yes. Scuba Diver certification carries forward, and time already logged usually counts toward completing full Open Water rather than starting again from scratch. Ask your instructor to confirm exactly what carries over before you book.

## Which Should You Choose?

- Short on time, or testing the water, literally? Scuba Diver gets you a real certification in about two days.
- Want to dive independently on future trips, anywhere in the world? Go straight for Open Water.
- Not sure? Ask your instructor — most can help you decide partway through which point you can switch at.',
 true, now(), 30)

on conflict (slug) do nothing;
