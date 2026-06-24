-- ============================================================================
-- Interim cover images for dives and courses — image_url was never seeded for
-- any row, so every dive/course detail page was missing its photo section
-- entirely. Reusing existing on-site gallery photos per dive site (no new
-- assets shot yet) so pages aren't photo-less while real photos are pending.
-- ============================================================================

update public.dives set image_url = '/images/gallery/g01.jpg' where site_key = 'tribe';
update public.dives set image_url = '/images/gallery/g02.jpg' where site_key = 'red';
update public.dives set image_url = '/images/gallery/g03.jpg' where site_key = 'light';
update public.dives set image_url = '/images/gallery/g04.jpg' where site_key = 'turtle';
update public.dives set image_url = '/images/gallery/g05.jpg' where site_key = 'multi';

update public.courses set image_url = '/images/home-courses.jpg';
