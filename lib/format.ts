import type { Dive } from './types';

// INR price formatting. Returns "On request" when no price / on_request flag.
export function formatPrice(price: number | null, onRequest?: boolean): string {
  if (onRequest || price == null) return 'On request';
  return '₹' + price.toLocaleString('en-IN');
}

// Duration label for a dive: prefer explicit override, else "X min dive · Y min training".
export function diveDuration(d: Dive): string {
  if (d.duration_label) return d.duration_label;
  const parts: string[] = [];
  if (d.dive_min) parts.push(`${d.dive_min} min dive`);
  if (d.train_min) parts.push(`${d.train_min} min training`);
  return parts.join(' · ');
}

// URL slug derived from a course name (no DB column needed).
export function courseSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// "from ₹X,XXX" across a set of dives (cheapest priced one).
export function fromPrice(dives: Dive[]): string {
  const priced = dives.filter((d) => !d.on_request && d.price != null).map((d) => d.price!);
  if (!priced.length) return 'On request';
  return '₹' + Math.min(...priced).toLocaleString('en-IN');
}
