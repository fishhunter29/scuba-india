-- 0022 — every reef price comes from the rate sheet.
--
-- The three reefs added in 0020 carried hand-typed prices, so the homepage row
-- ran ₹3,800–6,500 for what is the same dive. Clearing the override makes each
-- reef show the real price of the dive you actually book there, and keeps them
-- in step automatically whenever a dive price changes in admin.
--
-- A price can still be typed per reef in /admin -> Reefs if one genuinely
-- costs more; blank simply means "use the rate sheet".
-- Idempotent: safe to re-run.

update public.reefs set price = null where price is not null;

-- The duration shown is the dive's own, so drop the hand-typed labels too.
update public.reefs set duration_label = null where duration_label is not null;
