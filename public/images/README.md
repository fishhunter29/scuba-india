# Image slots — drop your photos here

Replace each placeholder by saving your own photo **with the exact same filename**
(same name, keep the extension as `.jpg`). The site picks it up automatically —
no code changes needed. Recommended sizes are guides, not hard rules.

| File | Where it shows | Recommended size | Shape |
|---|---|---|---|
| `home-try-dive.jpg` | Home → Experiences → "Try Scuba Dive" card | 800×600 | 4:3 landscape |
| `home-fun-dive.jpg` | Home → Experiences → "Fun Dives" card | 800×600 | 4:3 landscape |
| `home-courses.jpg` | Home → Experiences → "PADI Courses" card | 800×600 | 4:3 landscape |
| `marine-clownfish.jpg` | Learn → "Who you'll meet" gallery | 600×600 | square |
| `marine-turtle.jpg` | Learn → marine gallery (Green sea turtle) | 600×600 | square |
| `marine-parrotfish.jpg` | Learn → marine gallery (Parrotfish) | 600×600 | square |
| `marine-reef-shark.jpg` | Learn → marine gallery (Reef shark) | 600×600 | square |
| `marine-butterflyfish.jpg` | Learn → marine gallery (Butterflyfish) | 600×600 | square |
| `marine-moray-eel.jpg` | Learn → marine gallery (Moray eel) | 600×600 | square |
| `scuba-gears.jpeg` | Learn → "What you'll be wearing" (gear diagram) | 1216×872 | landscape |
| `hero-havelock.jpg` | Optional hero background (not wired by default) | 1600×900 | landscape |

## Notes
- **Dive photos** (the per-dive detail pages) and any **extra gallery images** are
  managed from the **admin panel** (`/admin → Dives` image field, and
  `/admin → Photos`), which upload to Supabase Storage — not from this folder.
- Keep filenames **lowercase, no spaces**. If you must rename, tell the developer
  so the reference can be updated.
- After replacing a file, do a hard refresh (Ctrl+F5) to bypass the browser cache.
