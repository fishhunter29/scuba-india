// Domain types mirroring the Supabase schema (SPEC §7).

export type SiteKey = 'tribe' | 'red' | 'light' | 'turtle' | 'multi';

export interface DiveStep {
  title: string;
  body: string;
}

export interface Dive {
  id: string;
  slug: string;
  name: string;
  site: string;
  site_key: SiteKey;
  depth_m: number | null;
  dive_min: number | null;
  train_min: number | null;
  duration_label: string | null;
  photos: number;
  gopro_min: number;
  price: number | null;
  on_request: boolean;
  tier: string | null;
  pitch: string | null;
  see_text: string | null;
  for_text: string | null;
  steps: DiveStep[];
  image_url: string | null;
  category: DiveKind | null; // explicit type, set in admin; drives all grouping
  active: boolean;
  sort: number;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string | null;
  depth: string | null;
  min_age: string | null;
  price: number | null;
  on_request: boolean;
  description: string | null;
  image_url: string | null;
  kind: CourseKind | null; // 'course' (single certification) or 'combo' (bundle)
  sort: number;
}

export type CourseKind = 'course' | 'combo';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string;
  sort: number;
  updated_at: string;
}

export interface Review {
  id: string;
  name: string;
  country: string | null;
  rating: number;
  text: string;
  featured: boolean;
  sort: number;
  created_at: string;
}

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'done';

export interface Booking {
  id: string;
  dive_id: string | null;
  name: string | null;
  contact: string | null;
  people: number | null;
  date: string | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  target_id: string | null;
  sort: number;
  created_at: string;
}

export interface Settings {
  id: number;
  review_count: number;
  rating_avg: number;
  dives_guided: string;
  phone: string;
  phone2: string | null;
  whatsapp: string;
  email: string;
  instagram: string | null;
  facebook: string | null;
  tripadvisor: string | null;
  address: string;
  address_map_url: string | null;
  google_url: string | null;
}

export const SITE_TABS: { key: SiteKey; label: string; depth?: string }[] = [
  { key: 'tribe', label: 'Tribe Gate', depth: '12m' },
  { key: 'red', label: 'Red Pillar', depth: '14m' },
  { key: 'light', label: 'Lighthouse', depth: '18m' },
  { key: 'turtle', label: 'Turtle Beach', depth: '16m' },
  { key: 'multi', label: 'Multi-site' },
];

export const SITE_INTRO: Record<SiteKey, { title: string; meta: string }> = {
  tribe: { title: 'Tribe Gate', meta: '12m · shallow reef · ideal for first-timers' },
  red: { title: 'Red Pillar', meta: '14m · coral & snorkelling · best value' },
  light: { title: 'Lighthouse', meta: '18m · deeper reef · for the more confident' },
  turtle: { title: 'Turtle Beach', meta: '16m · turtles & coral · group dives' },
  multi: { title: 'Multi-site & Experiences', meta: 'across Havelock' },
};

// Fine-grained dive type — set explicitly in admin via a friendly dropdown.
// This is the single source of truth that drives homepage grouping, the /prices
// page sections and the "ways to dive" cards, so a novice only sets it in one
// place. `kindToGroup` collapses it to the broad homepage tab.
export type DiveKind =
  | 'discover' // Discover Scuba from boat (beginners)
  | 'try_shore' // Try Dive, shore/beach entry (beginners)
  | 'fun' // Fun dive (certified)
  | 'night' // Night dive (certified)
  | 'snorkel' // Snorkelling (everyone)
  | 'island' // Island hopping (everyone)
  | 'charter'; // Private boat charter

// Friendly options for the admin "What kind of dive is this?" dropdown.
export const DIVE_KINDS: { value: DiveKind; label: string; help: string }[] = [
  { value: 'discover', label: 'Discover Scuba — boat (beginners)', help: 'First-timer dive from the boat. Shows under “Discover Scuba”.' },
  { value: 'try_shore', label: 'Try Dive — shore / beach (beginners)', help: 'First-timer dive entered from the beach. Shows under “Discover Scuba”.' },
  { value: 'fun', label: 'Fun Dive (certified divers)', help: 'For certified divers. Shows under “Fun Dives”.' },
  { value: 'night', label: 'Night Dive (certified divers)', help: 'After-dark dive for certified divers. Shows under “Fun Dives”.' },
  { value: 'snorkel', label: 'Snorkelling', help: 'No diving needed. Shows under “Experiences”.' },
  { value: 'island', label: 'Island Hopping', help: 'Full-day trip. Shows under “Experiences”.' },
  { value: 'charter', label: 'Boat Charter (private hire)', help: 'Private boat hire. Shows under “Experiences”.' },
];

// Homepage packages are grouped by what kind of dive it is (matching the rate
// sheet), not by reef — the reef is chosen on the day to suit conditions.
export type DiveCategory = 'discover' | 'fun' | 'experience';

// Collapse a fine dive kind to its broad homepage group.
export function kindToGroup(kind: DiveKind): DiveCategory {
  if (kind === 'discover' || kind === 'try_shore') return 'discover';
  if (kind === 'fun' || kind === 'night') return 'fun';
  return 'experience'; // snorkel | island | charter
}

export const CATEGORY_TABS: { key: DiveCategory; label: string }[] = [
  { key: 'discover', label: 'Discover Scuba' },
  { key: 'fun', label: 'Fun Dives' },
  { key: 'experience', label: 'Experiences' },
];

export const CATEGORY_INTRO: Record<DiveCategory, { title: string; meta: string }> = {
  discover: {
    title: 'Discover Scuba Diving',
    meta: 'For beginners · no experience needed · with PADI online DSD registration',
  },
  fun: { title: 'Fun Dives', meta: 'For certified divers · bring your certification card' },
  experience: { title: 'Experiences', meta: 'Snorkelling, island hopping & private boat charters' },
};
