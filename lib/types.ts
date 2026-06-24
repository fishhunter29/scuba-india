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
  sort: number;
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
