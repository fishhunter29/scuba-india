// Dive category taxonomy — one page per category, each explorable and bookable.
// Categories map to the fine-grained DiveKind values stored on each dive, so
// admin only ever sets "what kind of dive is this?" and the pages follow.

import type { DiveKind } from './types';

export interface CategoryTab {
  key: string;
  label: string;
  kinds?: DiveKind[]; // limit to these kinds
  // Match on the dive name instead. Stored as a regex *string* (not a
  // function) so the config can cross the server -> client boundary.
  nameRe?: string;
  nameReNot?: string;
}

export interface DiveCategoryPage {
  slug: string;
  nav: string; // short label for the nav
  plural: string; // natural plural for "see all …" links
  icon: 'try' | 'boat' | 'fun' | 'night' | 'snorkel' | 'island' | 'reef';
  entry: string; // shore / boat badge on the homepage card
  hook: string; // one-line hook for the homepage browse card
  title: string; // page H1
  eyebrow: string;
  tagline: string; // hero paragraph
  banner: string; // /images/<name> (.webp/.jpg)
  card: string; // square-ish image for the homepage curated card
  kinds: DiveKind[]; // which dives belong to this category
  audience: string;
  tabs: CategoryTab[];
  seoTitle: string;
  seoDescription: string;
}

export const DIVE_CATEGORIES: DiveCategoryPage[] = [
  {
    // The beginner entry point. Shore/beach try dives are no longer permitted
    // in Havelock — every dive now runs from the boat — so this category holds
    // all first-timer diving and keeps the "try dive" search intent.
    slug: 'boat-dive',
    nav: 'Discover Scuba',
    icon: 'try',
    entry: 'boat',
    hook: 'Your first breath underwater, guided every second.',
    plural: 'Discover Scuba dives',
    title: 'Discover Scuba — your first breath underwater',
    eyebrow: 'Beginners · no experience needed',
    tagline:
      'Breathe underwater for the first time with a PADI instructor holding you the whole way — no experience, no swimming skill, no certification needed. Every dive goes out by boat to quieter, richer reefs, and the HD photos and GoPro video are free.',
    banner: '/images/banner-courses',
    card: '/images/type-dsdboat',
    kinds: ['discover'],
    audience: 'First-timers · non-swimmers welcome',
    tabs: [
      { key: 'all', label: 'All Discover Scuba dives' },
      { key: 'single', label: 'Single dive', nameReNot: '2 ×|\\+' },
      { key: 'double', label: 'Two dives', nameRe: '2 ×|\\+' },
    ],
    seoTitle: 'Try Scuba Diving in Havelock — Discover Scuba Dives for Beginners',
    seoDescription:
      'Try scuba diving in Havelock (Swaraj Dweep), Andaman. No experience needed, PADI instructor at your side, 30 to 45 minutes underwater, HD photos and GoPro video free.',
  },
  {
    slug: 'fun-dive',
    nav: 'Fun Dive',
    icon: 'fun',
    entry: 'boat',
    hook: 'Explore Havelock’s best reefs, led by our divemasters.',
    plural: 'fun dives',
    title: 'Fun Dives — for certified divers',
    eyebrow: 'Certified divers · bring your card',
    tagline:
      'Already certified? Dive Havelock’s best reefs with our divemasters leading. Single dives, full days, multi-day packages, and the reef after dark.',
    banner: '/images/banner-guides',
    card: '/images/type-fun',
    kinds: ['fun', 'night'],
    audience: 'Certified divers',
    tabs: [
      { key: 'all', label: 'All fun dives' },
      { key: 'day', label: 'Day dives', kinds: ['fun'] },
      { key: 'night', label: 'Night dives', kinds: ['night'] },
    ],
    seoTitle: 'Fun Dives in Havelock for Certified Divers — Scuba India',
    seoDescription:
      'Guided fun dives and night dives in Havelock (Swaraj Dweep) for certified divers. Single dives, full days and multi-day packages with Scuba India.',
  },
  {
    slug: 'boat-experience',
    nav: 'Boat Experience',
    icon: 'island',
    entry: 'boat',
    hook: 'Snorkel, island-hop or take the whole boat — no diving needed.',
    plural: 'boat experiences',
    title: 'Boat Experiences — snorkelling, island hopping & charters',
    eyebrow: 'Everyone · no diving needed',
    tagline:
      'A day on the water without ever putting on a tank. Float over the reef, cruise between islands to a lighthouse sunset, or take the whole boat for yourselves.',
    banner: '/images/banner-prices',
    card: '/images/type-island',
    kinds: ['snorkel', 'island', 'charter'],
    audience: 'Everyone · non-swimmers welcome',
    tabs: [
      { key: 'all', label: 'All experiences' },
      { key: 'snorkel', label: 'Snorkelling', kinds: ['snorkel'] },
      { key: 'island', label: 'Island hopping', kinds: ['island'] },
      { key: 'charter', label: 'Boat charters', kinds: ['charter'] },
    ],
    seoTitle: 'Snorkelling, Island Hopping & Boat Charters in Havelock',
    seoDescription:
      'Open-sea snorkelling, island hopping trips and private boat charters around Havelock (Swaraj Dweep), Andaman. All gear included, no experience needed.',
  },
];

export function getCategory(slug: string): DiveCategoryPage | undefined {
  return DIVE_CATEGORIES.find((c) => c.slug === slug);
}

// Card/thumbnail image for a dive, by kind — one map, used by every card.
const KIND_IMG: Record<DiveKind, string> = {
  try_shore: 'type-dsdboat', // legacy: shore dives are no longer offered
  discover: 'type-dsdboat',
  fun: 'type-fun',
  night: 'type-night',
  snorkel: 'type-snorkel',
  island: 'type-island',
  charter: 'type-dsdboat',
};
export function diveImage(d: { image_url: string | null; category: DiveKind | null }, kind: DiveKind): string {
  return d.image_url ?? `/images/${KIND_IMG[kind] ?? 'type-dsdboat'}.jpg`;
}

// Which category page a given dive kind belongs to.
export function kindToCategorySlug(kind: DiveKind): string {
  return DIVE_CATEGORIES.find((c) => c.kinds.includes(kind))?.slug ?? 'boat-dive';
}

// Homepage curation. Hand-picked for now — this is the list that will later be
// driven from admin ("feature this on the homepage").
export const CURATED_SLUGS = [
  'discover-30', // the flagship beginner boat dive
  'fun-single', // for certified divers
  'boat-snorkelling', // non-divers
];

// The reef page is a "where you'll dive" category rather than a product list,
// so it has its own route — listed here so nav//sitemap can treat them alike.
export const REEF_CATEGORY = {
  slug: 'reefs',
  nav: 'Reef Dives',
  title: 'Reef Dives — the reefs we dive',
  seoTitle: 'Havelock Dive Sites — Reefs for Every Level of Diver',
  seoDescription:
    'Tribe Gate, Red Pillar, Lighthouse, Turtle Beach, Nemo Reef, Aquarium and The Wall — the reefs Scuba India dives in Havelock (Swaraj Dweep), with depths, marine life and prices.',
};
