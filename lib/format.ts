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

// "from ₹X,XXX" across a set of priced items (dives or courses).
export function fromPrice(items: { price: number | null; on_request: boolean }[]): string {
  const priced = items.filter((d) => !d.on_request && d.price != null).map((d) => d.price!);
  if (!priced.length) return 'On request';
  return '₹' + Math.min(...priced).toLocaleString('en-IN');
}

// The actual cheapest priced dive in a set — lets callers point a price hook
// (e.g. hero "from ₹X") back at the specific site/package it belongs to.
export function cheapestDive(dives: Dive[]): Dive | null {
  const priced = dives.filter((d) => !d.on_request && d.price != null);
  if (!priced.length) return null;
  return priced.reduce((min, d) => (d.price! < min.price! ? d : min), priced[0]);
}

// "919434290310" -> "+91 94342 90310" (for display; storage stays digits-only).
export function formatIndianPhone(digits: string): string {
  const d = (digits || '').replace(/[^\d]/g, '');
  if (d.startsWith('91') && d.length === 12) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  }
  return digits;
}

// Courses have no stored slug column — derive a stable URL slug from the name.
export function courseSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
