// One reef, one package.
//
// A reef is a place, not a product — what you actually buy there is a dive from
// the rate sheet. So every reef advertises exactly one package, and its price
// comes from the real dive unless someone overrides it in admin. Both the
// homepage cards and the reef explorer use this, so they can never disagree.

import type { Dive, DiveKind, Reef } from './types';
import { inferDiveKind } from './types';

// Which dive a reef leads with when it offers several kinds. Diving outranks
// snorkelling, so a reef doing both is never advertised at its cheaper
// snorkel price under a dive badge.
const HEADLINE_ORDER: DiveKind[] = [
  'discover',
  'fun',
  'night',
  'snorkel',
  'island',
  'charter',
  'try_shore', // legacy, never chosen in practice
];

const BADGE: Record<DiveKind, string> = {
  discover: 'Boat dive',
  fun: 'Boat dive',
  night: 'Night dive',
  snorkel: 'Snorkelling',
  island: 'Island hopping',
  charter: 'Private boat',
  try_shore: 'Boat dive', // legacy
};

export function headlineKind(kinds: DiveKind[]): DiveKind {
  return HEADLINE_ORDER.find((k) => kinds.includes(k)) ?? 'discover';
}

export interface ReefPackage {
  kind: DiveKind;
  badge: string; // "Boat dive", "Snorkelling", …
  name: string; // the dive being sold, e.g. "30-Min Discover Scuba Dive"
  price: number | null;
  onRequest: boolean;
  duration: string; // "30 min underwater"
  unit: string; // "per person" / "per couple"
}

function unitOf(d: Dive): string {
  const l = (d.duration_label ?? '').toLowerCase();
  if (l.includes('per couple')) return 'per couple';
  if (l.includes('per group')) return 'per group';
  if (l.includes('private boat')) return 'per boat';
  return 'per person';
}

// The single package on offer at this reef. Price is the reef's own override
// when admin has set one, otherwise the cheapest real dive of its headline
// kind — which keeps every reef in step with the rate sheet automatically.
export function reefPackage(
  reef: Pick<Reef, 'kinds' | 'price' | 'duration_label'>,
  dives: Dive[],
): ReefPackage {
  const kinds = (Array.isArray(reef.kinds) ? reef.kinds : []) as DiveKind[];
  const kind = headlineKind(kinds);

  const dive =
    dives
      .filter(
        (d) =>
          d.active !== false &&
          inferDiveKind(d) === kind &&
          (d.price != null || d.on_request),
      )
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0] ?? null;

  const price = reef.price ?? dive?.price ?? null;

  // A reef carrying its own price is sold as itself, not as a rate-sheet SKU —
  // borrowing the dive's name would imply the same product at two prices.
  const name = reef.price != null ? 'Guided boat dive' : dive?.name ?? 'Guided dive';

  return {
    kind,
    badge: BADGE[kind] ?? 'Boat dive',
    name,
    price,
    onRequest: price == null && (dive?.on_request ?? true),
    duration:
      reef.duration_label ||
      (dive?.dive_min ? `${dive.dive_min} min underwater` : 'One guided dive'),
    unit: dive ? unitOf(dive) : 'per person',
  };
}
