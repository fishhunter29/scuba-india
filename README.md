# Scuba India — Havelock Dive Centre

Production marketing + booking site for **Scuba India**, a PADI dive centre on
Havelock Island, Andaman. Built to the ink-wash ("sumi-e") visual target with a
verbatim Three.js GLSL background, a Supabase-backed CMS, functional WhatsApp
booking CTAs, an interactive first-timer guide, and a simple admin dashboard.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Three.js r128 ·
Supabase (Postgres + Auth + Storage) · Vercel.

---

## 1. Prerequisites

- Node.js 18.18+ (or 20+)
- A free [Supabase](https://supabase.com) project
- (optional) the [Supabase CLI](https://supabase.com/docs/guides/cli) for local DB

---

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find it | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` secret | **server only** (optional, for scripted seeding) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://scubaindia.in` | canonical URLs, sitemap, JSON-LD |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID (`G-XXXX`) | analytics (blank = off) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | analytics (blank = off) |

> The site renders with safe fallbacks even before Supabase is wired up, but all
> real content (dives, courses, reviews, settings) comes from the database.

---

## 3. Set up the database

In the Supabase dashboard → **SQL Editor**, run, in order:

1. `supabase/migrations/0001_init.sql` — schema, RLS policies, storage bucket.
2. `supabase/seed.sql` — real §8 dives, §9 courses, placeholder reviews, settings.

**Or** with the Supabase CLI (links to your project):

```bash
supabase db push          # applies migrations
# then paste seed.sql in the SQL editor, or:
psql "$DATABASE_URL" -f supabase/seed.sql
```

### Create the admin (owner) account

The admin dashboard uses Supabase Auth (email + password). Create the single
owner account:

- Supabase → **Authentication → Users → Add user** → enter the owner's email and
  a password, and tick **Auto Confirm User**.

That account can now sign in at `/admin/login`. (RLS gives any authenticated user
full write access — keep this to the one owner account.)

### Storage

The migration creates a public **`media`** bucket with authenticated-only
uploads. Admin image uploads (Photos, dive images) go here automatically.

---

## 4. Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

Key routes:

- `/` — home (one-scroll)
- `/[slug]` — per-dive detail pages, e.g. `/tribe-gate-premium`, `/fun-dives`
- `/learn-to-dive` — interactive first-timer guide
- `/admin` — dashboard (redirects to `/admin/login` if signed out)

---

## 5. Deploy to Vercel

1. Push this folder to a Git repo and **Import** it in Vercel.
2. Add all variables from §2 in **Vercel → Project → Settings → Environment
   Variables** (set `NEXT_PUBLIC_SITE_URL` to your production domain).
3. Deploy. Add the Supabase project's hostname is already allowed in
   `next.config.js` (`*.supabase.co`) for images.
4. **DNS:** point `scubaindia.in` (GoDaddy) at Vercel per Vercel's domain
   instructions. **Keep the old Wix site live until the new site is verified.**

---

## 6. What you still need to supply (content checklist)

These ship as placeholders — replace via the **/admin** dashboard (no code):

- [ ] **Review count** `[XX]` → Settings → Review count
- [ ] **Dives guided** `[X,000]` → Settings → Dives guided
- [ ] **3 real Google reviews** → Reviews (replace the 3 placeholders)
- [ ] **Average rating** confirm (default 4.8) → Settings
- [ ] **Phone / WhatsApp / Instagram** confirm → Settings
- [ ] **Real Havelock photos** → Photos (upload to replace the placeholder ink art
      and the "replace with your photo" slots; also set each dive's image)
- [ ] **GA4 + Meta Pixel IDs** → env vars `NEXT_PUBLIC_GA4_ID`,
      `NEXT_PUBLIC_META_PIXEL_ID`

> Footer email is fixed to **info@scubaindia.in** — never reintroduce the old
> competitor address.

---

## 7. Project structure

```
app/
  layout.tsx            root layout, fonts (Shippori Mincho / Hanken Grotesk / DM Mono), metadata
  globals.css           ported-verbatim prototype styles (English-only)
  pages.css             dive-detail / learn / admin styles
  page.tsx              home (one-scroll)
  [slug]/page.tsx       per-dive detail page (+ Product/Offer JSON-LD, WhatsApp CTA)
  learn-to-dive/page.tsx  interactive first-timer guide (+ FAQ JSON-LD)
  sitemap.ts robots.ts  SEO
  admin/                login + dashboard + CRUD (dives, courses, bookings, reviews, photos, settings)
components/
  InkBackground.tsx     VERBATIM GLSL ink shader (Three.js r128)
  ScrollFX.tsx          depth veil + 0→30m depth meter + nav blur + reveal
  Nav, Footer, WhatsAppFloat, Analytics, JsonLd, ReefAccents
  home/                 Hero, Experiences, Packages (tabs), Courses, DiveSites, WhyUs, Reviews, FinalCTA
  learn/                FearCheck, DiveChooser, GearExplorer
  admin/                AdminShell, ImageUpload, useToast
lib/
  supabase/             client / server / middleware / public clients
  data.ts types.ts schema.ts whatsapp.ts format.ts constants.ts
supabase/
  migrations/0001_init.sql   schema + RLS + storage
  seed.sql                   real prices & data
middleware.ts           refreshes auth session, guards /admin
```

---

## 8. Notes on the design

- The ink shader GLSL and Three.js init are **copied verbatim** from the
  prototype (`scubaindia-sumie-full.html`). Fonts are unchanged.
- All content sections, the final CTA and footer are `position:relative;
  z-index:3` so they sit above the fixed shader (z-index 0).
- `prefers-reduced-motion` is honoured; shader `pixelRatio` is capped at 2.
- Mobile collapses to one column under 920px with a nav drawer above the shader.
```
