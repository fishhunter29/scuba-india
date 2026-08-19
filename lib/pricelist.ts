// The /prices page is built from the live database (dives + courses) so that
// editing a price in admin updates the homepage AND the price list together —
// one source of truth, nothing to keep in sync by hand. Section titles and the
// order live here; every row comes from the DB, grouped by each dive's
// `category` and each course's `kind`.

import type { Dive, Course, DiveKind } from './types';

export interface PriceItem {
  name: string;
  sub?: string;
  price: number | null;
  onRequest?: boolean;
}

export interface PriceSection {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  items: PriceItem[];
}

function diveToItem(d: Dive): PriceItem {
  const bits: string[] = [];
  if (d.duration_label) bits.push(d.duration_label);
  else {
    if (d.dive_min) bits.push(`${d.dive_min} min underwater`);
    if (d.photos) bits.push(`${d.photos} photos`);
  }
  return { name: d.name, sub: bits.join(' · ') || undefined, price: d.price, onRequest: d.on_request };
}

function courseToItem(c: Course): PriceItem {
  const bits = [
    c.duration || null,
    c.depth && c.depth !== '—' ? c.depth : null,
    c.min_age && c.min_age !== 'None' ? `age ${c.min_age}` : null,
  ].filter(Boolean) as string[];
  return { name: c.name, sub: bits.join(' · ') || undefined, price: c.price, onRequest: c.on_request };
}

export function buildPriceSections(dives: Dive[], courses: Course[]): PriceSection[] {
  const inCats = (cats: DiveKind[]) =>
    dives
      .filter((d) => d.active !== false && d.category != null && cats.includes(d.category))
      .sort((a, b) => a.sort - b.sort)
      .map(diveToItem);

  const single = courses
    .filter((c) => (c.kind ?? 'course') !== 'combo')
    .sort((a, b) => a.sort - b.sort)
    .map(courseToItem);
  const combos = courses
    .filter((c) => c.kind === 'combo')
    .sort((a, b) => a.sort - b.sort)
    .map(courseToItem);

  const sections: PriceSection[] = [
    {
      id: 'discover',
      title: 'Dive Experiences for Beginners',
      subtitle: 'Discover Scuba Diving — with PADI online DSD registration. No experience needed.',
      note: 'Boat dives include HD photos and video, free. Shore dive is an indicative starting rate — confirm with us.',
      items: inCats(['try_shore', 'discover']),
    },
    {
      id: 'courses',
      title: 'PADI Courses',
      subtitle: 'Internationally recognised certifications, beginner to professional.',
      items: single,
    },
    {
      id: 'combos',
      title: 'Course Combos',
      subtitle: 'Bundle courses and save — the fastest route to your next certification.',
      items: combos,
    },
    {
      id: 'fun-dives',
      title: 'Fun Dives',
      subtitle: 'For certified divers only. Bring your certification card.',
      items: inCats(['fun', 'night']),
    },
    {
      id: 'charters',
      title: 'Boat Charters',
      subtitle: 'Private boat hire for your group, by the hour or half day.',
      items: inCats(['charter']),
    },
    {
      id: 'experiences',
      title: 'Snorkelling & Island Hopping',
      subtitle: 'Open-sea experiences around Havelock (Swaraj Dweep) — no diving needed.',
      note: 'Open-sea snorkelling is an indicative starting rate — confirm with us.',
      items: inCats(['snorkel', 'island']),
    },
  ];

  return sections.filter((s) => s.items.length > 0);
}
