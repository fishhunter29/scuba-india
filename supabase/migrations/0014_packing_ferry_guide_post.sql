-- ============================================================================
-- Seed the lead-magnet guide post: getting to Havelock by ferry, and what to
-- pack for a diving trip. Ferry operator names, jetty locations and journey
-- durations are stable facts; exact sailing *times* are deliberately left out
-- since operators revise them seasonally — the post tells readers to confirm
-- times when booking rather than quoting clock times that could go stale.
-- ============================================================================
insert into public.posts (slug, title, excerpt, body, published, published_at, sort) values

('andaman-packing-ferry-guide-2026',
 'Andaman Packing & Ferry Guide: Getting to Havelock and What to Bring',
 'How to actually get from Port Blair to Havelock by ferry, and what''s worth packing for a diving trip here — no fluff, no guesswork.',
 '## Getting from Port Blair to Havelock

Havelock has no airport — every visitor reaches it by ferry from Port Blair, a roughly 38-nautical-mile crossing. A handful of private operators run the route, including **Makruzz**, **Green Ocean**, **Nautika** and **ITT Majestic**, alongside slower **government ferries**.

- **Private ferries** (Makruzz, Green Ocean, Nautika, ITT Majestic) depart from **Haddo Wharf** in Port Blair and take roughly **90 minutes to 2 hours 15 minutes**, depending on the operator and vessel.
- **Government ferries** depart from **Phoenix Bay Jetty**, take around **2.5 hours**, and cost less — but seats are limited and booking is less predictable for visitors.
- Operators run several sailings a day, with more added in peak season (roughly November to April) and fewer off-season.

**Exact sailing times change with the season and between operators**, so rather than print a timetable that goes stale, our advice is simple: book your ferry a few days ahead once your travel dates are fixed, and double-check the current schedule directly with the operator or your travel agent at that time. If you''re already booked with us, message us on WhatsApp and we''ll help you sense-check your timings against your dive slot.

## What to Pack for Your Trip

We provide all the actual diving gear — mask, fins, tank, BCD, and wetsuit if needed — so you don''t need to buy or bring any of that. Here''s what''s actually worth packing:

- **Light, breathable clothing.** Havelock is tropical and humid most of the year; quick-dry fabrics are more comfortable than anything heavy.
- **Reef-safe sunscreen.** Regular sunscreen can harm coral — reef-safe formulas are increasingly easy to find before you travel.
- **A hat, sunglasses and a rash guard or buff** for sun protection during boat rides and beach time.
- **A dry bag** for your phone and camera during the jetty transfer and boat rides — splashes happen.
- **Sufficient cash.** ATMs on Havelock are limited and card acceptance can be patchy outside the main resorts, so it''s worth carrying more cash than you think you''ll need.
- **A power bank.** Power on the island is generally reliable but not flawless — handy for travel days.
- **Basic seasickness remedies** if you''re prone to motion sickness, for the ferry crossing.
- **Your ID/passport**, and for foreign nationals, any permit documents required for travel within the Andaman Islands — check current entry requirements before you fly, as these can change.
- **Your own mask**, if you''re a certified diver with a prescription or fit preference — otherwise ours will do.

## One Honest Note

We''d rather you arrive relaxed and on time than rushed. If anything about your ferry connection or pickup timing feels unclear once you''ve booked your dive with us, message us on WhatsApp before you travel — we''ll talk you through it directly rather than leaving you to guess.',
 true, now(), 40)

on conflict (slug) do nothing;
