-- The "anyone insert booking" policy allowed unauthenticated inserts into
-- public.bookings with no validation. No app code (public or admin) ever
-- inserts into this table — all booking CTAs go to WhatsApp instead — so
-- this was a dormant, wide-open write surface. Replace it with an
-- authenticated-only insert policy to match the other admin-write tables.
drop policy if exists "anyone insert booking" on public.bookings;

create policy "admin insert bookings" on public.bookings
  for insert to authenticated with check (true);
