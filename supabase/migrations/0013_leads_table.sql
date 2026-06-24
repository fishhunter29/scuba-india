-- ============================================================================
-- leads — lead-magnet capture (Andaman Packing & Ferry Guide download).
-- Public insert is intentional and actually used by components/learn/LeadMagnet —
-- unlike the old dormant "anyone insert booking" policy removed in migration
-- 0004, this one backs a live form. Only admin can read/manage captured leads.
-- ============================================================================
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  phone       text,
  email       text,
  source      text not null default 'ferry_packing_guide',
  created_at  timestamptz not null default now(),
  constraint leads_contact_required check (phone is not null or email is not null)
);

alter table public.leads enable row level security;

create policy "anyone insert lead" on public.leads
  for insert with check (phone is not null or email is not null);
create policy "admin read leads" on public.leads
  for select to authenticated using (true);
create policy "admin delete leads" on public.leads
  for delete to authenticated using (true);
