-- Adds a second public contact number to settings (shown in the footer
-- alongside the primary phone; editable from /admin → Settings).
alter table public.settings
  add column if not exists phone2 text default '';
