-- Adds a Google Maps link for the dive centre's address (makes the
-- footer address clickable; editable from /admin → Settings).
alter table public.settings
  add column if not exists address_map_url text default '';
