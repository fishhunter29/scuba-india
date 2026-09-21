-- 0024 — bring back Aquarium, and give every reef a real photo.
--
-- Aquarium was hidden in 0023 because it wasn't on the client's price list;
-- it is one of the reefs, so it comes back. Its price is the one figure we
-- have for it (₹6,500) — CONFIRM THIS and change it in /admin -> Reefs if the
-- client's rate differs.
--
-- Reef photos were AI placeholders or borrowed dive-type images. These are
-- real Scuba India gallery shots, matched to each reef by what's in them —
-- three of them were actually taken at the reef they're now used for.
-- Idempotent: safe to re-run.

-- ---------- 1. Aquarium is back --------------------------------------------
update public.reefs
set active = true,
    featured = true,
    depth_m = 12,
    level = 'All levels',
    price = coalesce(price, 6500),
    kinds = '["discover","fun"]'::jsonb,
    best_for = 'Boat dives & snorkelling',
    blurb = 'Coral bommies rising from clean sand, with so much fish in the water column that you swim through the schools rather than towards them — the reef that earns its name.',
    life = '["Snapper schools","Fusiliers","Damselfish","Coral bommies"]'::jsonb,
    sort = 65
where key = 'aquarium';

-- ---------- 2. Real photos from the gallery --------------------------------
-- Shot at the reef itself:
update public.reefs set image_url = '/images/gallery/g28' where key = 'red';    -- ruby snapper at Red Pillar
update public.reefs set image_url = '/images/gallery/g29' where key = 'tribe';  -- clownfish + turtle at Tribe Gate
update public.reefs set image_url = '/images/gallery/g26' where key = 'light';  -- trevally at Lighthouse

-- Matched to what each reef is known for:
update public.reefs set image_url = '/images/gallery/g08' where key = 'aquarium'; -- diver inside a school of fusiliers
update public.reefs set image_url = '/images/gallery/g17' where key = 'purple';   -- lionfish under a rocky ledge
update public.reefs set image_url = '/images/gallery/g25' where key = 'slope';    -- staghorn coral spreading across the reef
update public.reefs set image_url = '/images/gallery/g27' where key = 'juvis';    -- moorish idols over a big coral mound

-- Turtle Beach keeps its existing image: no gallery shot shows a turtle there.
-- Swap it in /admin -> Reefs as soon as there is one.
