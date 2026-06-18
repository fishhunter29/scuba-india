-- Adds the Google reviews URL to settings (powers the "Read all reviews on
-- Google" button on the home page; editable from /admin → Settings).
alter table public.settings
  add column if not exists google_url text default '';
