-- 0021 — shore / beach Try Dives are no longer permitted in Havelock.
--
-- Only boat-accompanied diving is allowed now, so the shore Try Dive product
-- and its category are retired. Beginners are served by Discover Scuba, which
-- is guided from the boat. Idempotent: safe to re-run.

-- ---------- 1. Retire the shore Try Dive product ---------------------------
-- Deactivated rather than deleted, so its booking history and any links to it
-- survive. Delete it in /admin -> Dives if you want it gone entirely.
update public.dives
set active = false, featured = false
where slug = 'try-shore' or category = 'try_shore';

-- ---------- 2. Anything still tagged shore becomes a boat Discover Scuba ---
update public.dives set category = 'discover' where category = 'try_shore';

-- ---------- 3. Keep the homepage row full ----------------------------------
-- 0019 featured the shore Try Dive; promote the flagship boat dive instead.
update public.dives set featured = true
where slug = 'discover-30' and active is not false;

-- ---------- 4. Drop shore entry from every reef ----------------------------
update public.reefs
set kinds = (
  select coalesce(jsonb_agg(k), '[]'::jsonb)
  from jsonb_array_elements(kinds) k
  where k <> '"try_shore"'::jsonb
)
where kinds @> '["try_shore"]'::jsonb;

-- A reef that offered nothing but shore entry now offers the boat dive.
update public.reefs set kinds = '["discover"]'::jsonb where kinds = '[]'::jsonb;
