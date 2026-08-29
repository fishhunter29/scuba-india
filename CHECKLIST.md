# Scuba India — Go-Live & Handover Checklist

Everything to verify before/at handover. The **code is deployment-ready**; the
open items are content + configuration on the live instance (Supabase + Vercel).
Tick each box as you confirm it on the live site.

---

## 1. Database — run these in Supabase → SQL Editor (in order)

Run once, top to bottom. Each is idempotent (safe to re-run). "Success. No rows
returned" is the correct result for these.

- [ ] `supabase/migrations/0016_swap_phone_whatsapp.sql` — swaps the calling
      number and WhatsApp number on the live settings row.
- [ ] `supabase/migrations/0017_align_prices_to_rate_sheet.sql` — the full
      rate-sheet catalogue (Discover Scuba by duration, Fun Dives, courses,
      combos, boat charters).
- [ ] `supabase/migrations/0018_dive_category_course_kind.sql` — adds the
      `category` / `kind` columns, the shore Try Dive, and aligns island
      hopping. **Required** — the price list & reef prices key off these.
- [ ] `supabase/migrations/0019_editable_sections.sql` — makes the rest of the
      site editable from admin: adds `dives.featured` (homepage “Most booked”),
      the `reefs` table and the `sections` table (page wording), seeded with the
      current live text so nothing changes visually until you edit it.

> If 0017/0018 haven't run, the homepage/prices fall back to inference and may
> not match the intended catalogue exactly.

## 2. Admin → Settings (fills the trust bar & contact info)

Log in at `/admin`. Empty fields render visible placeholders like
`[XX]+ reviews`, so fill them all:

- [ ] **Review count** and **Rating** (or wire Google, see §4)
- [ ] **Dives guided** (replaces the `[X,000]+` placeholder)
- [ ] **Phone** and **WhatsApp number** — confirm they are the right way round
- [ ] **Email** = `info@scubaindia.in` (must not be a competitor's)
- [ ] **Instagram / Facebook / TripAdvisor** URLs (blank ⇒ the header icons
      link to nothing)
- [ ] **Address** + **Address map URL**

## 3. Vercel → Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server only)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://scubaindia.in`
- [ ] `NEXT_PUBLIC_GA4_ID` — Google Analytics (blank = tracking off)
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel (blank = off)
- [ ] `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_LABEL` (if running Ads)

## 4. Google reviews (optional but recommended)

- [ ] `GOOGLE_MAPS_API_KEY` and `GOOGLE_PLACE_ID` set → live rating + reviews.
- [ ] Otherwise add a few **real** Google reviews via `/admin → Reviews`
      (never fake names/quotes).

## 5. Content

- [ ] Add real reviews (`/admin → Reviews`).
- [ ] Upload real photos where possible (`/admin → Photos`) — the reef and
      dive-type card images are AI placeholders and are worth replacing with
      genuine underwater shots.
- [ ] Sanity-check every price on `/prices`, the homepage Packages tabs, and the
      reef explorer — they should all agree (single source of truth).

## 6. Smoke test on the live site (mobile + desktop)

- [ ] Homepage loads; hero, all sections and images render.
- [ ] Nav → **Dives** menu opens; each category page loads:
      `/dives/try-dive`, `/dives/boat-dive`, `/dives/fun-dive`,
      `/dives/boat-experience`, `/reefs`, `/courses`.
- [ ] Option tabs on each category page filter the list correctly.
- [ ] Tapping a dive-type card on the homepage opens its category page.
- [ ] Reef explorer: switching reefs updates the panel + shows its dive list.
- [ ] Every **Book / WhatsApp / Call** button opens the right chat/dialer with
      the correct number.
- [ ] Header **Instagram / Facebook / TripAdvisor** icons open the right pages.
- [ ] `/prices`, `/learn-to-dive`, `/guides`, the category pages, and the
      individual dive and course pages all load with their top banner image.
- [ ] Browser **back button** returns cleanly (no flashing sections).
- [ ] Facebook domain verification still present (already added to `<head>`).

## 7. SEO / housekeeping (already in code — just confirm live)

- [ ] `https://scubaindia.in/sitemap.xml` and `/robots.txt` resolve.
- [ ] Page titles/descriptions look right (share a link on WhatsApp to check the
      preview card).

---

### What you can edit in `/admin`

| Screen | Controls |
|---|---|
| **Dives** | Every dive/experience: name, price, what's included, photos, which category it belongs to, and **“Feature on the homepage”** for the “Most booked” row |
| **Courses** | PADI courses and combos |
| **Reefs** | The four reefs: name, depth, level, description, marine life, photo, and which dives run there |
| **Page Sections** | The wording of each block — Why Scuba India, Meet the crew, the reef heading, the gallery heading and the closing call-to-action |
| **Photos** | Upload gallery photos (category `gallery`) — these replace the bundled gallery |
| **Reviews / Bookings / Guides / Settings** | As before |

### Notes for whoever maintains this

- **All content is managed from `/admin`** — no code changes needed to update
  prices, add dives, change section wording, or swap the reefs.
- **Deploys are automatic**: pushing to the `main` branch on GitHub triggers a
  Vercel build. Edits in `/admin` appear within ~1 minute (no deploy needed).
- Setup, env vars and DB details are in the root [`README.md`](./README.md);
  reference material is in [`docs/`](./docs/).
