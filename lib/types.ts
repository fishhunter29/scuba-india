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



// Fine-grained dive type — set explicitly in admin via a friendly dropdown.
// This is the single source of truth: it decides which category page a dive
// appears on, which tab it lands in there, its section on /prices and its card
// on the homepage. Admin sets this one field and everything follows.
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
  { value: 'discover', label: 'Discover Scuba — boat (beginners)', help: 'First-timer dive from the boat. Appears on the Boat Dive page.' },
  { value: 'try_shore', label: 'Try Dive — shore / beach (beginners)', help: 'First-timer dive entered from the beach. Appears on the Try Dive page.' },
  { value: 'fun', label: 'Fun Dive (certified divers)', help: 'For certified divers. Appears on the Fun Dive page, “Day dives” tab.' },
  { value: 'night', label: 'Night Dive (certified divers)', help: 'After-dark dive for certified divers. Appears on the Fun Dive page, “Night dives” tab.' },
  { value: 'snorkel', label: 'Snorkelling', help: 'No diving needed. Appears on the Boat Experience page, “Snorkelling” tab.' },
  { value: 'island', label: 'Island Hopping', help: 'Full-day trip. Appears on the Boat Experience page, “Island hopping” tab.' },
  { value: 'charter', label: 'Boat Charter (private hire)', help: 'Private boat hire. Appears on the Boat Experience page, “Boat charters” tab.' },
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

// The dive's kind — the explicit `category` if set, otherwise inferred from
// slug / tier / training so the site keeps working even before migration 0018
// has run against the live database.
export function inferDiveKind(d: {
  category: DiveKind | null;
  slug: string;
  tier: string | null;
  train_min: number | null;
  on_request: boolean;
}): DiveKind {
  if (d.category) return d.category;
  const slug = d.slug || '';
  if (slug.startsWith('charter')) return 'charter';
  if (slug.includes('island')) return 'island';
  if (slug.includes('snorkel')) return 'snorkel';
  if (slug.includes('night')) return 'night';
  if (d.tier === 'Certified') return 'fun';
  if (slug.includes('shore')) return 'try_shore';
  if (d.train_min != null && !d.on_request) return 'discover';
  return 'discover';
}


