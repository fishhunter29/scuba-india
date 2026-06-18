-- Adds the Facebook page URL to settings (shows the Facebook button in the
-- footer; editable from /admin → Settings).
alter table public.settings
  add column if not exists facebook text default '';
