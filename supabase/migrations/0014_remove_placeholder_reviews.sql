-- ============================================================================
-- Remove the 3 placeholder reviews seeded in supabase/seed.sql §SPEC10 ("Pull
-- a real 5-star Google review here…") — they were never swapped for real
-- ones and are showing live on the site as the Reviews section fallback
-- (components/home/Reviews.tsx renders these whenever Google Places review
-- data isn't configured). Matched by the placeholder name so real reviews
-- entered later are never touched.
-- ============================================================================
delete from public.reviews where name = 'Reviewer name';
