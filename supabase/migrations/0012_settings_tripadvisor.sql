-- Adds the TripAdvisor listing URL to settings (shows the TripAdvisor button
-- in the footer alongside Facebook/Instagram; editable from /admin → Settings).
alter table public.settings
  add column if not exists tripadvisor text default '';

update public.settings set
  tripadvisor = 'https://www.tripadvisor.com/Attraction_Review-g23098910-d24300107-Reviews-Scuba_India-Swaraj_Dweep_Havelock_Island_Andaman_and_Nicobar_Islands.html'
where id = 1;
