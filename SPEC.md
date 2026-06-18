# Scuba India — Build Spec (Havelock Dive Shop, full-stack)

> Source of truth for a coding agent (Claude Code). A single-file visual prototype exists as `scubaindia-sumie-full.html` — **match its look and the GLSL shader exactly.** This spec extends it into a full-stack site with an admin dashboard, functional CTAs with per-dive detail, and one interactive info page.

---

## 1. Product

A marketing + booking site for **Scuba India**, a PADI dive centre on **Havelock Island, Andaman**. Most visitors are **first-time divers**. Goal: convert paid SEO/ad traffic into dive bookings (primarily via WhatsApp).

**English only.** Remove any non-English (Japanese/kanji) text from the prototype — keep the ink-wash *aesthetic*, but all labels, eyebrows, and the logo mark must be English. Replace the 海 hanko seal with an English monogram "SI" or a small dive icon; replace kanji section eyebrows with English words.

---

## 2. Stack

- Next.js (App Router) + TypeScript + Tailwind CSS.
- Three.js (r128) ink shader — copy GLSL from prototype verbatim.
- Supabase (Postgres, Auth, Storage for images). Free tier.
- Admin: protected `/admin` (Supabase Auth email login) — the "simple Wix-like dashboard."
- Hosting: Vercel (web) + Supabase (data).
- Booking: CTAs open a detailed dive page then WhatsApp deep-link to book. No payment gateway in v1.
- Analytics: GA4 + Meta Pixel in <head>.

---

## 3. Design system (do NOT change fonts)

- Headings Shippori Mincho. Body Hanken Grotesk. Labels/meta DM Mono. (Latin-capable typefaces; "English only" refers to text content, not typeface names.)
- Tokens: paper #F4EFE4, deep paper #EDE6D6, ink #1B1A17, soft ink #4A4640, ash #7A746B, vermilion #C8472E (accent only), deep vermilion #A83A24, indigo #2E4A52.
- Keep: paper-grain overlay, ink brush-wipe headline reveal, vermilion-only accents.
- Remove ALL kanji/Japanese. English eyebrows instead: "Choose your dive", "Dives & Packages", "PADI Certification", "Where you'll dive", "Why Scuba India", "Reviews".

---

## 4. Background, full-page (signature)

Fixed full-page Three.js ink shader at z-index 0; content sections translucent washi (rgba(244,239,228,.66) / rgba(237,230,214,.72) + backdrop-filter blur(2px)) so ink shows through the whole page. Scroll-driven #depthveil darkens surface->deep. Right-side depth meter 0m->30m (vermilion dot). STACKING RULE: all content sections, final CTA, and footer = position:relative; z-index:3 (else they hide behind the fixed bg). Cap shader pixelRatio at 2; honour prefers-reduced-motion; test on mid-range Android.

---

## 5. Public pages

### 5.1 Home (one-scroll)
Nav -> Hero -> Experiences (3 cards) -> Packages (filterable tabs by site) -> Courses (PADI rate table) -> Dive Sites (animated depth bars) -> Why Us -> Reviews -> Final CTA -> Footer + floating WhatsApp.

### 5.2 Dive detail pages (functional CTAs)
Every Book/See CTA links to a detail page for that dive: route /[dive-slug] (e.g. /tribe-gate-premium). Static-feel but COLOURFUL (richer warm reef accents than the calm home page). Includes:
- Hero strip: dive name, site, depth, duration, price per person, one-line pitch.
- What's included (photos count, GoPro, training time, pickup/drop).
- What you'll see (reef/marine life copy for that site).
- Who it's for (esp. reassuring first-timer copy).
- How it works: step-by-step (arrive -> brief -> gear -> dive -> photos).
- Colourful SVG coral/fish accents, warm gradient panels; no heavy animation, keep crisp.
- Primary CTA "Book on WhatsApp" -> https://wa.me/917695003828?text=Hi%20Scuba%20India%2C%20I'd%20like%20to%20book%20[PACKAGE]%20at%20[SITE] (URL-encoded, pre-filled).
- All data from the DB so admin can edit.

### 5.3 Interactive info page (first-timer focused)
One page, route /learn-to-dive: "Scuba diving, explained" — engaging and INTERACTIVE since most visitors are first-timers. Build several:
- Interactive depth explorer: slider/scroll descending 0->30m showing light, pressure, what you see at each depth.
- "Is it safe?" expandable FAQ accordions (ears/pressure, can't swim well, breathing, marine life).
- Try Dive vs PADI Course chooser: 2-3 question interactive that recommends a starting option and links to the matching dive page.
- Gear walkthrough: click hotspots on a diver illustration.
- Marine life gallery: hover/tap cards of what you'll see in Havelock reefs.
- End with CTA into Try Scuba Dive -> WhatsApp.
- Reassuring, jargon-free tone. Link from nav ("New to diving?") and Try Dive CTAs.

### 5.4 SEO
Per-page metadata; JSON-LD SportsActivityLocation + AggregateRating (4.8, reviewCount from DB) + Product/Offer per dive + FAQPage on info page. Sitemap + robots. GA4 + Meta Pixel. Intents: "scuba diving Havelock", "PADI course Andaman", "try dive Havelock price", "first time scuba diving Andaman".

---

## 6. Admin dashboard (simple Wix-like control panel)

Protected /admin, Supabase Auth (email/password; single owner account to start). Clean simple dashboard in the site's ink/washi style controlling EVERYTHING:

- Packages/Dives: CRUD (name, site, depth, duration, training time, inclusions, photos count, GoPro mins, price, tier, what-you'll-see, who-it's-for, steps, active toggle, slug). Edits reflect instantly on home, detail pages, tabs.
- Courses: CRUD (name, duration, depth, min age, price, description).
- Bookings/Enquiries: table with status (new/contacted/confirmed/done) + notes; support manual logging since booking is WhatsApp-first.
- Reviews: CRUD (name, country, rating, text, featured); update headline review count + average (feeds trust bar + schema).
- Photos: upload to Supabase Storage; assign to dives/sites/hero/gallery; replace placeholders.
- Settings: review count, dives-guided, phone, WhatsApp, email (default info@scubaindia.in), Instagram, address.

Keep admin UI genuinely simple: sidebar (Dives, Courses, Bookings, Reviews, Photos, Settings), clear save buttons, optimistic updates.

---

## 7. Database schema (Supabase / Postgres)

- dives (id, slug, name, site, depth_m, dive_min, train_min, photos, gopro_min, price, tier, pitch, see_text, for_text, steps jsonb, image_url, active, sort)
- courses (id, name, duration, depth, min_age, price, description, sort)
- reviews (id, name, country, rating, text, featured, created_at)
- bookings (id, dive_id, name, contact, people, date, status, notes, created_at)
- photos (id, url, alt, category, target_id)
- settings (singleton: review_count, dives_guided, phone, whatsapp, email, instagram, address)
- RLS: public read on dives/courses/reviews/photos/settings; writes only for authenticated admin.

Seed DB with real data in sections 8/9.

---

## 8. Dives & packages — REAL data (seed these)

All include pickup & drop within 5km unless noted. Prices per person, INR.

Tribe Gate (12m, shallow reef, first-timers):
- Light Pack — 20min dive + 40min training — 20 photos + 2min GoPro — Rs 3,500 (Light)
- Light Plus — 30+40 — 30 photos + 3min — Rs 4,000 (Light)
- Premium — 40+50 — 40 photos + 4min — Rs 4,500 (Premium)
- Premium Plus — 50+50 — 50 photos + 5min — Rs 6,000 (Premium+)

Red Pillar (14m, coral & snorkelling, best value):
- Light Pack — 20+40 — 20 photos + 2min — Rs 2,500 (Light)
- Light Plus — 30+40 — 30 photos + 3min — Rs 3,000 (Light)
- Premium — 40+50 — 40 photos + 4min — Rs 4,000 (Premium)
- Premium Plus — 45+50 — 40 photos + 4min — Rs 5,000 (Premium+)
- Boat Snorkelling — full day, all gear — Rs 2,000

Lighthouse (18m, deeper reef):
- Scuba Diving — Lighthouse — 30+30 — 30 photos + 3min — Rs 4,500 (Signature)

Turtle Beach (16m, turtles & coral, group dives):
- Group of 4+ — 45+30 — 40 photos + 4min — Rs 6,500
- 2 persons — 45+30 — 40 photos + 4min — Rs 7,500

Multi-site:
- Fun Dives (Red Pillar & Tribe Gate) — 45min, two sites — 30 photos + 3min — Rs 8,000 (Certified)
- Island Hopping Trip — half-day 6h, sunset at Lighthouse — On request

---

## 9. PADI courses — REAL data (seed these)

| Course | Duration | Depth | Min age | Price (Rs) |
|---|---|---|---|---|
| PADI Scuba Diver | 2 days | 12m | 12/15 | 18,000 |
| PADI Open Water Diver | 3-4 days | 18m | 12/15 | 25,000 |
| PADI Adventure Diver | 1-2 days | 30m | 12/15 | On request |
| PADI Advanced Open Water | 2-3 days | 30m | 12/15 | 22,000 |
| Emergency First Responder (EFR) | 1-1.5 days | - | None | 8,000 |
| PADI Rescue Diver | 3-4 days | - | 12/15 | 22,000 |

---

## 10. Content still needed (placeholders)

[XX] review count; [X,000] dives guided; 3 real Google reviews; real Havelock photos (owner's own beat stock — key differentiator); confirm phone/Instagram. Footer email = info@scubaindia.in (the old Wix site wrongly used a competitor's lacadives.com — never reintroduce it).

---

## 11. Build order

1. Next.js + Tailwind + fonts + tokens; Supabase project + schema + seed data.
2. Static home (English only, no kanji) matching prototype, data from Supabase.
3. Ink shader + full-page translucency + depth veil + depth meter.
4. Packages tabs; dive detail pages with WhatsApp CTAs; courses table.
5. Interactive info page (/learn-to-dive).
6. Admin (/admin) with auth + CRUD on dives/courses/reviews/photos/bookings/settings + image upload.
7. SEO (metadata, JSON-LD, sitemap), GA4 + Pixel, Google Business Profile.
8. Replace placeholders; mobile pass; reduced-motion; Lighthouse/perf (shader on Android).
9. Deploy Vercel; point scubaindia.in DNS (GoDaddy) at Vercel; keep Wix live until verified.

---

## 12. Reference

scubaindia-sumie-full.html = visual + behavioural target (copy the GLSL shader and animation timings verbatim). English-only is the one content change from the prototype.
