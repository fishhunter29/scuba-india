// The "ways to dive" taxonomy — the engagement entry point on the homepage.
// Every visitor self-identifies here, then flows on to the reefs (#sites) and
// the packages/prices (#packages, /prices). Prices marked `approx` are
// indicative market rates (Havelock operators) where no rate-sheet figure
// exists yet — edit here to set your own.

import type { DiveKind } from './types';

export type DiveEntry = 'shore' | 'boat' | 'boat / shore' | '—';

export interface DiveTypeInfo {
  key: string;
  name: string;
  icon: 'try' | 'boat' | 'fun' | 'night' | 'snorkel' | 'island';
  category: DiveKind; // links the card to its dives in the DB for live pricing
  image: string; // /images/<name> base path (.webp/.jpg)
  entry: DiveEntry;
  audience: string; // who it's for (short)
  hook: string; // one-line pitch
  detail: string; // a sentence more, for the expanded card
  fromPrice: number | null; // INR — fallback when the DB has no matching dive
  priceUnit?: string; // e.g. 'per couple'
  approx?: boolean; // indicative market price, not a rate-sheet figure
  href: string; // where the CTA goes
}

export const DIVE_TYPES: DiveTypeInfo[] = [
  {
    key: 'try-shore',
    name: 'Try Dive — Shore',
    icon: 'try',
    category: 'try_shore',
    image: '/images/type-tryshore',
    entry: 'shore',
    audience: 'First-timers · no experience',
    hook: 'Your first breath underwater, walking in from the beach.',
    detail:
      'The gentlest, most budget-friendly way to try scuba — shallow, calm, shore-entry water with a PADI instructor holding you the whole time.',
    fromPrice: 3500,
    approx: true,
    href: '/#packages',
  },
  {
    key: 'dsd-boat',
    name: 'Discover Scuba — Boat',
    icon: 'boat',
    category: 'discover',
    image: '/images/type-dsdboat',
    entry: 'boat',
    audience: 'First-timers · no experience',
    hook: 'A short boat ride to quieter reefs, then your first dive.',
    detail:
      'Our signature beginner dive from the boat — richer reefs, better fish life and free HD photos and GoPro video. 30 to 45 minutes underwater.',
    fromPrice: 3800,
    href: '/#packages',
  },
  {
    key: 'fun',
    name: 'Fun Dives',
    icon: 'fun',
    category: 'fun',
    image: '/images/type-fun',
    entry: 'boat',
    audience: 'Certified divers',
    hook: 'Explore Havelock’s best reefs, led by our divemasters.',
    detail:
      'Bring your certification card and dive — single dives, full days and multi-day packages across the islands’ healthiest sites.',
    fromPrice: 4000,
    href: '/#packages',
  },
  {
    key: 'night',
    name: 'Night Dive',
    icon: 'night',
    category: 'night',
    image: '/images/type-night',
    entry: 'boat',
    audience: 'Certified divers',
    hook: 'The reef after dark — a whole different world by torchlight.',
    detail:
      'Hunting lionfish, sleeping parrotfish, crabs and shrimp in the open, and bioluminescence sparkling around you. Torches and full guiding included.',
    fromPrice: 4500,
    href: '/#packages',
  },
  {
    key: 'snorkel',
    name: 'Open-Sea Snorkelling',
    icon: 'snorkel',
    category: 'snorkel',
    image: '/images/type-snorkel',
    entry: 'boat',
    audience: 'Everyone · non-swimmers welcome',
    hook: 'Float over the reef and watch the fish — no diving needed.',
    detail:
      'A boat out to clear open water with all gear and a flotation vest if you’d like one. Perfect for families, kids and anyone not ready to dive.',
    fromPrice: 2500,
    approx: true,
    href: '/#packages',
  },
  {
    key: 'island',
    name: 'Island Hopping',
    icon: 'island',
    category: 'island',
    image: '/images/type-island',
    entry: 'boat',
    audience: 'Everyone',
    hook: 'A day on the water — snorkel, dive and sunset at the lighthouse.',
    detail:
      'A relaxed cruise around Havelock’s coast and islands with snorkel and scuba stops, finishing with golden light at the Lighthouse.',
    fromPrice: 25000,
    priceUnit: 'per couple',
    href: '/#packages',
  },
];
