-- ============================================================================
-- Set cover images for the 3 seeded guide posts. No new assets were shot for
-- these guides yet, so each post reuses an existing on-site photo from
-- public/images/ rather than shipping with no image at all.
-- ============================================================================

update public.posts set cover_image_url = '/images/gallery/g05.jpg'
where slug = 'best-time-to-dive-havelock-andaman';

update public.posts set cover_image_url = '/images/home-try-dive.jpg'
where slug = 'first-scuba-dive-what-to-expect';

update public.posts set cover_image_url = '/images/home-courses.jpg'
where slug = 'padi-open-water-vs-scuba-diver';
