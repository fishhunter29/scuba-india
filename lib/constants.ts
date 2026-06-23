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
  phone: '+91 76950 03828',
  phone2: '',
  whatsapp: DEFAULT_WHATSAPP,
  email: DEFAULT_EMAIL,
  instagram: '',
  facebook: '',
  address: 'Havelock Island, Andaman',
  google_url: '',
};
