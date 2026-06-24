-- ============================================================================
-- Revert the Packing & Ferry Guide lead-magnet experiment (decided against
-- after shipping it — banner removed from /learn-to-dive). Safe to run
-- whether or not 0013_leads_table.sql / 0014_packing_ferry_guide_post.sql
-- (now deleted from the repo) were ever applied.
-- ============================================================================
drop table if exists public.leads cascade;
delete from public.posts where slug = 'andaman-packing-ferry-guide-2026';
