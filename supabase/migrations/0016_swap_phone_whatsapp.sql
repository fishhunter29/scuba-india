-- Swaps the calling number and WhatsApp number on the live settings row,
-- regardless of their current values. `phone` is stored formatted
-- ("+91 XXXXX XXXXX"); `whatsapp` is stored as country-code-prefixed digits
-- only ("91XXXXXXXXXX") — each side is reformatted to match its column's
-- convention rather than swapped as raw strings.
update public.settings
set
  phone = '+91 '
    || substr(right(regexp_replace(whatsapp, '\D', '', 'g'), 10), 1, 5)
    || ' '
    || substr(right(regexp_replace(whatsapp, '\D', '', 'g'), 10), 6, 5),
  whatsapp = regexp_replace(phone, '\D', '', 'g')
where id = 1;
