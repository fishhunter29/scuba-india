// The /prices page is built from the live database (dives + courses) so that
// editing a price in admin updates the homepage AND the price list together —
// one source of truth, nothing to keep in sync by hand. Section titles and the
// order live here; every row comes from the DB, grouped by each dive's
// `category` and each course's `kind`.

import type { Dive, Course, DiveKind } from './types';
import { DIVE_CATEGORIES } from './categories';
import { inferDiveKind } from './types';

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
      .filter((d) => d.active !== false && cats.includes(inferDiveKind(d)))
      .sort((a, b) => a.sort - b.sort)
      .map(diveToItem);

  const byKind = (kind: 'course' | 'combo') =>
    courses
      .filter((c) => (c.kind ?? 'course') === kind)
      .sort((a, b) => a.sort - b.sort)
      .map(courseToItem);

  // One section per dive category — same taxonomy, order and wording as the
  // nav, the homepage grid and the /dives/<category> pages, so a visitor sees
  // the identical structure wherever they look. Courses follow.
  const sections: PriceSection[] = [
    ...DIVE_CATEGORIES.map((c) => ({
      id: c.slug,
      title: c.nav,
      subtitle: c.audience,
      items: inCats(c.kinds),
    })),
    {
      id: 'courses',
      title: 'PADI Courses',
      subtitle: 'Internationally recognised certifications, beginner to professional.',
      items: byKind('course'),
    },
    {
      id: 'combos',
      title: 'Course Combos',
      subtitle: 'Bundle courses and save — the fastest route to your next certification.',
      items: byKind('combo'),
    },
  ];

  return sections.filter((s) => s.items.length > 0);
}
