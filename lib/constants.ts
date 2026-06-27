// Shared constants & safe fallbacks (used when the DB is unreachable so the
// site still renders during local dev before Supabase is wired up).

import type { Settings } from './types';

export const SITE_NAME = 'Scuba India';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://scubaindia.in';

// WhatsApp number (SPEC §5.2). Keep in sync with settings.whatsapp.
export const DEFAULT_WHATSAPP = '917695003828';

// Footer email MUST be info@scubaindia.in (SPEC §10 — never the competitor's).
const DEFAULT_EMAIL = 'info@scubaindia.in';

export const FALLBACK_SETTINGS: Settings = {
  id: 1,
  review_count: 0,
  rating_avg: 4.8,
  dives_guided: '[X,000]',
  phone: '+91 94342 90310',
  phone2: '',
  whatsapp: DEFAULT_WHATSAPP,
  email: DEFAULT_EMAIL,
  instagram: '',
  facebook: '',
  tripadvisor: '',
  address:
    'Govind Nagar -2, Near Helipad Ground, Swaradjdweep (HAVELOCK) Islan, Andaman & Nicobar Island 744211, No State, India',
  address_map_url:
    'https://google.com/maps/search/Govind%20Nagar%20-2%2C%20Near%20Helipad%20Ground%2C%20Swaradjdweep%20%28HAVELOCK%29%20Islan%2C%20Andaman%20%26%20Nicobar%20Island%20744211%2C%20No%20State%2C%20India',
  google_url: '',
};
